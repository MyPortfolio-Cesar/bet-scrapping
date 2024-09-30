function puntosDiferenciaPosiciones(dataPosicion){
    let puntaje = 0;
    let dataLocal;
    let dataVisitante;
    dataPosicion.forEach(item => {
        if(item.isLocal){
            dataLocal = item;
        }else if(!item.isLocal){
            dataVisitante = item;
        }
    })

    let diferenciaDePosiciones = dataLocal.posicion - dataVisitante.posicion;

    if(diferenciaDePosiciones >= -4 && diferenciaDePosiciones <= -1){
        puntaje = 0
    } else if(diferenciaDePosiciones >= -9 && diferenciaDePosiciones <= -5) {
        puntaje = 0.5
    } else if(diferenciaDePosiciones >= -15 && diferenciaDePosiciones <= -10) {
        puntaje = 1
    } else if(diferenciaDePosiciones >= -19 && diferenciaDePosiciones <= -16) {
        puntaje = 1.5
    } else if(diferenciaDePosiciones <= -20) {
        puntaje = 2
    } else if(diferenciaDePosiciones >= 1 && diferenciaDePosiciones <= 4) {
        puntaje = 0
    } else if(diferenciaDePosiciones >= 5 && diferenciaDePosiciones <= 9) {
        puntaje = 0.5
    } else if(diferenciaDePosiciones >= 10 && diferenciaDePosiciones <= 15) {
        puntaje = 1
    } else if(diferenciaDePosiciones >= 16) {
        puntaje = 1.5
    } else {
        puntaje = 0
    }

    return puntaje;
}

function puntosPromedioGolesLigaByTeam(promediosTeams, promedioLiga){
    console.log('promediosTeams', promediosTeams)
    let team1 = promediosTeams[0]
    let team2 = promediosTeams[1]
    console.log('team1', team1)
    console.log('team2', team2)
    let puntos = 0;
    if(team1 >= promedioLiga && team2 >= promedioLiga){
        puntos = 1
    } else if (team1 < promedioLiga && team2 < promedioLiga){
        puntos = 0
    } else if (team1 < promedioLiga && team2 >= promedioLiga){
        puntos = 0.5
    }  else if (team1 >= promedioLiga && team2 < promedioLiga){
        puntos = 0.5
    }

    return puntos;

}

function puntosPromedioEntreAmbosEquipos(result){
    let puntos = 0;
    let promedioTotal = 0;
    result.forEach(t => {
        promedioTotal = promedioTotal + t.promedioTotalGoles
    })

    promedioTotal = promedioTotal / 2;
    if(promedioTotal <= 1.5){
        puntos = 0;
    }else if(promedioTotal > 1.5 && promedioTotal <= 2){
        puntos = 0.5;
    }else if(promedioTotal > 2 && promedioTotal <= 2.5){
        puntos = 1.25;
    }else if(promedioTotal > 2.5){
        puntos = 1.75;
    }

    return puntos;
}

function puntosRachaPartidos(result){
    let dataLocal;
    let dataVisitante;
    let puntos = 0;

    result.forEach(t => {
        if(t.promedioGolesLocalVisitante.isLocal){
            dataLocal = t.rachaPartidosTeam;
        } else if(!t.promedioGolesLocalVisitante.isLocal) {
            dataVisitante = t.rachaPartidosTeam
        }
    })

    if(dataLocal.porcentajeGanados >= 80 && dataVisitante.porcentajePerdidos >= 60){
        puntos = 2
    } else if(dataLocal.porcentajeGanados >= 60 && dataLocal.porcentajeGanados < 80 && dataVisitante.porcentajePerdidos >= 60){
        puntos = 1.75
    } else if(dataLocal.porcentajeGanados >= 30 && dataLocal.porcentajeGanados < 60 && dataVisitante.porcentajePerdidos >= 60){
        puntos = 1.5
    } else if(dataLocal.porcentajeGanados < 30 && dataVisitante.porcentajePerdidos >= 60){
        puntos = 0.5
    } else if(dataLocal.porcentajeGanados >= 80 && dataVisitante.porcentajePerdidos >= 30 && dataVisitante.porcentajePerdidos < 60){
        puntos = 1.75
    } else if(dataLocal.porcentajeGanados < 80 && dataLocal.porcentajeGanados >=60 && dataVisitante.porcentajePerdidos >= 30 && dataVisitante.porcentajePerdidos < 60){
        puntos = 1.25
    } else if(dataLocal.porcentajeGanados >= 30 && dataLocal.porcentajeGanados < 60 && dataVisitante.porcentajePerdidos >= 30 && dataVisitante.porcentajePerdidos < 60){
        puntos = 0.75
    } else if(dataLocal.porcentajeGanados < 30 && dataVisitante.porcentajePerdidos >= 30 && dataVisitante.porcentajePerdidos < 60){
        puntos = 0
    } else if(dataLocal.porcentajeGanados >= 60 && dataVisitante.porcentajeGanados >= 80){
        puntos = 1
    } else if(dataLocal.porcentajeGanados < 50 && dataVisitante.porcentajeGanados >= 80){
        puntos = 1.5
    }

    return puntos;
}

function puntosPromedioGolesLocalVisitante(result){
    let dataLocal;
    let dataVisitante;
    let puntos = 0;

    result.forEach(t => {
        if(t.promedioGolesLocalVisitante.isLocal){
            dataLocal = t.promedioGolesLocalVisitante
        } else if(!t.promedioGolesLocalVisitante.isLocal) {
            dataVisitante = t.promedioGolesLocalVisitante
        }
    })

    if(dataLocal.promedioLocal < 1 && dataVisitante.promedioVisitante < 1){
        puntos = 0
    } else if(dataLocal.promedioLocal >= 1 && dataLocal.promedioLocal < 1.5 && dataVisitante.promedioVisitante < 1){
        puntos = 0.5
    } else if(dataLocal.promedioLocal >= 1.5 && dataLocal.promedioLocal < 2 && dataVisitante.promedioVisitante < 1){
        puntos = 1
    } else if(dataLocal.promedioLocal >= 2 && dataVisitante.promedioVisitante < 1){
        puntos = 1.5
    } else if(dataLocal.promedioLocal < 1 && dataVisitante.promedioVisitante >= 1 && dataVisitante.promedioVisitante < 1.5){
        puntos = 0
    } else if(dataLocal.promedioLocal >= 1 && dataLocal.promedioLocal < 1.5 && dataVisitante.promedioVisitante >= 1 && dataVisitante.promedioVisitante < 1.5){
        puntos = 0.5
    } else if(dataLocal.promedioLocal >= 1.5 && dataLocal.promedioLocal < 2 && dataVisitante.promedioVisitante >= 1 && dataVisitante.promedioVisitante < 1.5){
        puntos = 1
    } else if(dataLocal.promedioLocal >= 2 && dataVisitante.promedioVisitante >= 1 && dataVisitante.promedioVisitante < 1.5){
        puntos = 1.5
    } else if(dataLocal.promedioLocal < 1 && dataVisitante.promedioVisitante >= 1.5 && dataVisitante.promedioVisitante < 2){
        puntos = 0.5
    } else if(dataLocal.promedioLocal >= 1 && dataLocal.promedioLocal < 1.5 && dataVisitante.promedioVisitante >= 1.5 && dataVisitante.promedioVisitante < 2){
        puntos = 1
    } else if(dataLocal.promedioLocal >= 1.5 && dataLocal.promedioLocal < 2 && dataVisitante.promedioVisitante >= 1.5 && dataVisitante.promedioVisitante < 2){
        puntos = 1.5
    } else if(dataLocal.promedioLocal >= 2 && dataVisitante.promedioVisitante >= 1.5 && dataVisitante.promedioVisitante < 2){
        puntos = 1.5
    } else if(dataLocal.promedioLocal < 1 && dataVisitante.promedioVisitante >= 2){
        puntos = 0.5
    } else if(dataLocal.promedioLocal >= 1 && dataLocal.promedioLocal < 1.5 && dataVisitante.promedioVisitante >= 2){
        puntos = 1
    } else if(dataLocal.promedioLocal >= 1.5 && dataLocal.promedioLocal < 2 && dataVisitante.promedioVisitante >= 2){
        puntos = 1.5
    } else if(dataLocal.promedioLocal >= 2 && dataVisitante.promedioVisitante >= 2){
        puntos = 2
    }

    return puntos;
}



module.exports = {
    puntosDiferenciaPosiciones,
    puntosPromedioEntreAmbosEquipos,
    puntosRachaPartidos,
    puntosPromedioGolesLocalVisitante,
    puntosPromedioGolesLigaByTeam
}