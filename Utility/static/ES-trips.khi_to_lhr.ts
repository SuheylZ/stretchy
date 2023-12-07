import { Client } from "@elastic/elasticsearch" //run npm i @elastic/elasticsearch

export default class Es_trips_khi_to_lhr {
        client = new Client({
        node: 'http://localhost:9200',
        auth: { username: "muneeb", password: "theshining" }
      })

search = async (text: string)=>{
        const res = await this.client.search({
            index: 'trips.khi_to_lhr',
            body: {
              query: {
                wildcard: {totalPassengers:`*${text}*`,departureAt:`*${text}*`}
              }
            }
          })
          return res
    }

searchExact = async (text: string)=>{
        const res = await this.client.search({
            index: 'trips.khi_to_lhr',
            body: {
              query: {
                match: {totalPassengers:`${text}`,departureAt:`${text}`}
              }
            }
          })
          return res
    }
    }