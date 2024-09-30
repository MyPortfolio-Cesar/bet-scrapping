const {LigaConfig} = require('./match');


async function getTableInfo(page){
    
    await page.goto(LigaConfig.ligaConfig.liga_link)

    const tableData = await page.evaluate(() => {
        const table = document.querySelector('table.leaguetable.sortable.table');
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText);
        console.log('headers', headers)
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const rowData = {};
            
            cells.forEach((cell, index) => {
                if (cell.classList.contains('large-link')){
                    const link = cell.querySelector('a');
                    if(link){
                        rowData['link-team'] = link.href
                    }
                }
                
                rowData[headers[index]] = cell.innerText;
            });
            return rowData;
          });
      
      });
    

    return tableData;
} 



module.exports = {
    getTableInfo
}