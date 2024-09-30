'use strict'
const pupperteer = require('puppeteer')
const {arrayTeamsToAnalize, LigaConfig, diasParaAnalizar} = require('./match'); 


const {getTableInfo} = require('./getLigaInfo')
const {puntosDiferenciaPosiciones, puntosPromedioEntreAmbosEquipos,
    puntosRachaPartidos, puntosPromedioGolesLocalVisitante, puntosPromedioGolesLigaByTeam
} = require('./functions-puntaje/puntosDiferenciaPosiciones');

function promedioDeGolLiga(table){
    let promedio = 0;
    for(let i=0; i<table.length;i++){
        promedio += (parseInt(table[i].GF) + parseInt(table[i].GC)) / parseInt(table[i].PJ)
    }
    return promedio / (table.length)
}

function rachaPartidos(validMatches, isLocal){

    let ganados = 0;
    let perdidos = 0;
    let empatados = 0;
    validMatches.forEach(m => {
        let score = m.score;
        let scoreLocal = Number(score.split(' - ')[0])
        let scoreVisitante = Number(score.split(' - ')[1])

        if(scoreLocal > scoreVisitante && isLocal){
            ganados = ganados + 1;
        } else if(scoreLocal > scoreVisitante && !isLocal){
            perdidos = perdidos + 1;
        } else if(scoreLocal < scoreVisitante && isLocal){
            perdidos = perdidos + 1;
        } else if(scoreLocal < scoreVisitante && !isLocal) {
            ganados = ganados + 1
        } else if(scoreLocal == scoreVisitante) {
            empatados = empatados + 1;
        }
    })

    let porcentajeGanados = (ganados / validMatches.length) * 100;
    let porcentajePerdidos = (perdidos / validMatches.length) * 100;
    let porcentajeEmpatados = (empatados / validMatches.length) * 100;

    return {
        porcentajeGanados,
        porcentajePerdidos,
        porcentajeEmpatados
    }

}

async function getInfoScore(page, url){
    console.log('url', url)
    await page.goto(url)
    const result = await page.evaluate(() => {
        const link = Array.from(document.querySelectorAll('#submenu ul li a')).find(a => a.textContent.trim() === 'Partidos');
        const tableScore = Array.from(document.querySelectorAll('div.block_match_goals ul.scorer-info'))
        const rowData = [];
        tableScore.map(row => {
            const lines = Array.from(row.querySelectorAll('li'));
            

            lines.forEach(l => {
                const spans = Array.from(l.querySelectorAll('span'));
                spans.forEach((s, index) => {
                    const spanInside = s.querySelector('span')
                    if(spanInside && spanInside.classList.contains('minute') ){
                         
                        let minuteContent = spanInside.textContent.trim()
                        rowData.push({
                            minute: minuteContent,
                            from : index == 0 ? 'Local' : 'Visitante'
                        })
                    }
                })
            })

        })
        return rowData;
    })

    return result;
}

async function getInfoTeam(page, url, team, isLocal){
    
    // const page = await browser.newPage()
    console.log('entro a url', url)
    await page.goto(url)
    await page.evaluate(() => {
        const link = Array.from(document.querySelectorAll('#submenu ul li a')).find(a => a.textContent.trim() === 'Partidos');
        if (link) {
            link.click();
          }
        // console.log('submenu', subMenu);
    })

    await page.waitForNavigation();

    const tableMatches = await page.evaluate(() => {
        const table = document.querySelector('table.matches');
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText);
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const rowData = {};
            
            cells.forEach((cell, index) => {
                if (cell.classList.contains('score')){
                    const link = cell.querySelector('a');
                    if(link){
                        rowData['link-match-detail'] = link.href
                    }
                }
                
                rowData[headers[index]] = cell.innerText;
            });
            return rowData;
        })
    })

    // console.log('table matches', tableMatches)

    let currentDate = new Date();
    currentDate.setDate(new Date().getDate()-1)
    // Crear una nueva fecha basada en la fecha actual
    const dateTwoMonthsAgo = new Date(currentDate);

    // Restar 2 meses
    dateTwoMonthsAgo.setDate(dateTwoMonthsAgo.getDate() - diasParaAnalizar);

    let validMatches = tableMatches.filter(m => {
        
        let date = parseDate(m.Fecha)

        return date <= currentDate && date >= dateTwoMonthsAgo && m["Competición"] == LigaConfig.ligaConfig.tipo_competicion
    }).map(match => {
        return {
            team: team,
            date: match["Fecha"],
            teamLocal: match["Resultado"],
            teamVisitante: match["Puntaje (partido anterior)/Tiempo"],
            score: match["Equipo local"],
            'link-match-detail': match["link-match-detail"]
        }
    })

    // console.log('validMatches', validMatches)

    // for(const [index, info] of validMatches.entries()){
    //     const infoScore = await getInfoScore(page, info["link-match-detail"])
    //     // console.log('infoScore', infoScore)
    //     validMatches[index]["score-info"] = JSON.stringify(infoScore)
    // }

    console.log('validMatches', validMatches)

    let promedioTotalGoles = calculatePromedioTotalGoles(validMatches)

    let promedioGolesLocalVisitante = calculatePromedioGolesLocalVisitante(validMatches, team, isLocal);

    let rachaPartidosTeam = rachaPartidos(validMatches, isLocal);

    return {
        team: team,
        promedioTotalGoles: promedioTotalGoles,
        promedioGolesLocalVisitante: promedioGolesLocalVisitante,
        rachaPartidosTeam
    }
    // await browser.close();

}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`20${year}-${month}-${day}`);
};

function calculateDiferenciaDePosicion(tableInfo, arrayEquiposToAnalize){

    let namesTeams = arrayEquiposToAnalize.map(item => item.team);
    console.log('namesTeams', namesTeams)
    let dataPosicion = [];
    tableInfo.forEach(item => {
        if(namesTeams.includes(item["Equipo"])){
            let isLocal = arrayEquiposToAnalize.some(t => {
                if(t.team == item["Equipo"]){
                    return t.isLocal
                }
            } )
            let obj = {
                team: item["Equipo"],
                posicion: Number(item["#"]),
                isLocal
            }
            dataPosicion.push(obj);
        }
    })

    console.log('dataposicion', dataPosicion);
    return dataPosicion;

}

async function analizeMatchByTeam(arrayEquiposToAnalize){
    try {
        const browser = await pupperteer.launch({
            headless: false,
        });

        const page = await browser.newPage()
        const tableInfo = await getTableInfo(page);
        console.log(tableInfo)

        
        const promedioGolLiga = promedioDeGolLiga(tableInfo);
        console.log('PROMEDIO DE GOLES EN LIGA', promedioGolLiga)


        let dataDiferenciaPosiciones = calculateDiferenciaDePosicion(tableInfo, arrayEquiposToAnalize)
        
        let puntos2= puntosDiferenciaPosiciones(dataDiferenciaPosiciones);

        console.log('puntos2', puntos2)

        let result = [];
        // await getInfoTeam(page, tableInfo[0]["link-team"])    

        // let arrayEquipos = arrayEquiposToAnalize.map(item => item.team);
        let promedio = 0;
        for(const team of tableInfo){
            if(arrayEquiposToAnalize.some(t => t.team == team["Equipo"])){
                let isLocal = arrayEquiposToAnalize.some(t => {
                    if(t.team == team["Equipo"]){
                        return t.isLocal
                    }
                } )
                console.log('isLocal', isLocal)
                console.log('equipo', team["Equipo"])
                console.log('link', team["link-team"])
                let resultDataInfoTeam = await getInfoTeam(page, team["link-team"], team["Equipo"], isLocal)
                console.log('resultDataInfoTeam', resultDataInfoTeam)
                result.push(resultDataInfoTeam)
                promedio = promedio + resultDataInfoTeam.promedioTotalGoles;
            }
            
        }

        promedio = promedio/2;

        let promedioGolesLigaByTeam = calculatePromedioGolesLigaByTeam(tableInfo, arrayEquiposToAnalize)
        let puntos5 = puntosPromedioGolesLigaByTeam(promedioGolesLigaByTeam, promedioGolLiga);

        console.log('Average goals in the league per team', puntos5)
        console.log('promedioGolesLigaByTeam', promedioGolesLigaByTeam)
        console.log('results', result)

        let puntos4 = puntosPromedioGolesLocalVisitante(result)

        console.log('Average points - Home and away', puntos4)

        let puntos3 = puntosRachaPartidos(result);

        console.log('Streak of matches', puntos3)

        let puntos1 = puntosPromedioEntreAmbosEquipos(result)
        console.log('Average points between both teams', puntos1)

        let sumaPuntos = puntos1 + puntos2 + puntos3 + puntos4 + puntos5;

        console.log('sumaPuntos', sumaPuntos);

        if(sumaPuntos >= 4.5){
            console.log('Valid for betting!')
        }else {
            console.log('Dont bet on this match!')
        }
      

        await browser.close();
    } catch(err) {
        console.log('err: ', err)
    }
    
}



// getTableInfo()

analizeMatchByTeam(arrayTeamsToAnalize)

function calculatePromedioTotalGoles(array){
    let promedio = 0;
    array.forEach(item => {
        let score = item.score;
        let scoreLocal = Number(score.split(' - ')[0])
        let scoreVisitante = Number(score.split(' - ')[1])
        promedio = promedio + (scoreLocal + scoreVisitante)
    })

    promedio = (promedio / array.length)
    console.log('promedio', promedio)

    return promedio;
}

function calculatePromedioGolesLocalVisitante(array, team, isLocal){
    let promedioLocal = 0;
    let promedioVisitante = 0;
    let cantidadPartidos = 0;
    
    array.forEach(m => {
        if(m.team == team && isLocal ){
            let score = m.score;
            let scoreLocal = Number(score.split(' - ')[0])
            promedioLocal += scoreLocal;
            cantidadPartidos += 1;
            // isLocal = true;
        }else if(m.team == team && !isLocal ){
            let score = m.score;
            let scoreVisitante = Number(score.split(' - ')[1])
            promedioVisitante += scoreVisitante;
            cantidadPartidos += 1;
            // isVisitante = true;
        }
    })

    promedioLocal = promedioLocal / cantidadPartidos
    promedioVisitante = promedioVisitante / cantidadPartidos

    return {
        promedioLocal,
        promedioVisitante,
        isLocal,
        cantidadPartidos
    }

}

function calculatePromedioGolesLigaByTeam(tablaInfo, arrayEquiposToAnalize){
    let namesTeams = arrayEquiposToAnalize.map(item => item.team)
    let promedios = []
    tablaInfo.forEach(team => {
        if(namesTeams.includes(team["Equipo"])){
            promedios.push((Number(team["GF"]) + Number(team["GC"])) / Number(team["PJ"]))
        }
    })

    return promedios;
}

