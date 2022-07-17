const url = 'https://api-irrigacao.herokuapp.com/sensor/allData'

async function getData(url, count){
    const data = await axios.get(url)

    return data.data.results.slice(0, count)
}

function collectValue(dataJson){
    let dados = []
    dataJson.map((data) =>{
        return dados.push(data.valorSensor)
    })

    return dados
}

function collectDate(dataJson){
    let dados = []
    dataJson.map((data) =>{

        const date = formatdate(data.dataHora, false)
        if(!dados.includes(date)){
            return dados.push(date)
        }
    })  

    return dados.reverse()
}

function collectId(dataJson){
    let id = []
    dataJson.map((data) =>{
        if(!id.includes(data.id_sensor)){
            return id.push(data.id_sensor)
        }
    })

    return id
}

function formatdate(date, format){
    const YMD = date.split('T')
    const separatedDate = YMD[0].split('-')
    const separatedHour = YMD[1].split(':')

    var hourString = `${separatedHour[0]}:${separatedHour[1]}`
    var dateString = `${separatedDate[2]}-${separatedDate[1]}`

    if(format){
        return `${hourString} ${dateString}`
    } 
    else {
        return `${hourString}`
    }
}

function separateData(dataJson){
    data = [[], []]

    dataJson.map(dataMap => {
        if(dataMap.id_sensor == 0){
            data[0].push(dataMap.valorSensor)
        }
        else if(dataMap.id_sensor == 1){
            data[1].push(dataMap.valorSensor)
        }
    })

    return data
}

getData(url, 32)
.then(response =>{
    // console.log(response)
    
    const dados = collectValue(response)
    const labels = collectDate(response)
    const id = collectId(response)
    const dataSeparated = separateData(response)

    console.log(dataSeparated)

    const data = {
        labels: labels,
        datasets: [{
          label: `Sensor ${id[0]}`,
          backgroundColor: 'rgb(255, 0, 132)',
          borderColor: 'rgb(255, 0, 150)',
          data: dataSeparated[0].reverse(),
          tension: 0.3
        },
        {
        label: `Sensor ${id[1]}`,
        backgroundColor: 'rgb(0, 50, 132)',
        borderColor: 'rgb(0, 50, 132)',
        data: dataSeparated[1].reverse(),
        tension: 0.3
        }
    ],
    };
    
    const config = {
        type: 'line',
        data: data,
        options:{
            y: {
                min: 0,
                max: 100
            }
        }
    };
    
    const myChart = new Chart(
        document.getElementsByClassName('myChart'),
        config
    );
})