import axios from 'axios';

const url = 'http://localhost:5000'

export class WorldStatistics {
  timestamp: number = 0
  countryName: string = ''
  totalConfirmed: number = 0
  totalCured: number = 0
  totalDeath: number = 0
}
export class TotalStatistics {
  timestamp: number = 0
  totalConfirmed: number = 0
  totalCured: number = 0
  totalDeath: number = 0
}

export async function getCountryDaily(countryName: string, timeStart: Date, timeStop: Date) {
  const tsStart = timeStart.valueOf() / 1000
  const tsStop = timeStop.valueOf() / 1000

  const resp = await axios.get(url + '/World/country/daily', {
    params: {
      countryName: countryName,
      tsStart: tsStart,
      tsStop: tsStop
    }
  })
  return resp.data as WorldStatistics[]
}

export async function getCountryWeekly(countryName: string, timeStart: Date, timeStop: Date) {
  const tsStart = timeStart.valueOf() / 1000
  const tsStop = timeStop.valueOf() / 1000

  const resp = await axios.get(url + '/World/country/weekly', {
    params: {
      countryName: countryName,
      tsStart: tsStart,
      tsStop: tsStop
    }
  })
  return resp.data as WorldStatistics[]
}

export async function getCountryMonthly(countryName: string, timeStart: Date, timeStop: Date) {
  const tsStart = timeStart.valueOf() / 1000
  const tsStop = timeStop.valueOf() / 1000

  const resp = await axios.get(url + '/World/country/monthly', {
    params: {
      countryName: countryName,
      tsStart: tsStart,
      tsStop: tsStop
    }
  })
  return resp.data as WorldStatistics[]
}

export async function getWorldAtTime(date: Date) {
  const ts = date.valueOf() / 1000
  const resp = await axios.get(url + `/World/attime/${ts}`)
  return resp.data as WorldStatistics[]
}

export async function getTotalDaily(timeStart: Date, timeStop: Date) {
  const tsStart = timeStart.valueOf() / 1000
  const tsStop = timeStop.valueOf() / 1000

  const resp = await axios.get(url + '/Total/daily', {
    params: {
      tsStart: tsStart,
      tsStop: tsStop
    }
  })
  return resp.data as WorldStatistics[]
}

export async function getTotalWeekly(timeStart: Date, timeStop: Date) {
  const tsStart = timeStart.valueOf() / 1000
  const tsStop = timeStop.valueOf() / 1000

  const resp = await axios.get(url + '/Total/weekly', {
    params: {
      tsStart: tsStart,
      tsStop: tsStop
    }
  })
  return resp.data as WorldStatistics[]
}

export async function getTotalMonthly(timeStart: Date, timeStop: Date) {
  const tsStart = timeStart.valueOf() / 1000
  const tsStop = timeStop.valueOf() / 1000

  const resp = await axios.get(url + '/Total/monthly', {
    params: {
      tsStart: tsStart,
      tsStop: tsStop
    }
  })
  return resp.data as WorldStatistics[]
}

export async function getTotalAtTime(date: Date) {
  const ts = date.valueOf() / 1000
  const resp = await axios.get(url + `/Total/attime/${ts}`)
  return resp.data as WorldStatistics
}