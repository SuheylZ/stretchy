import { Client } from "@elastic/elasticsearch" //run npm i @elastic/elasticsearch

export default class Es_booking_hotel {
        client = new Client({
        node: 'http://localhost:9200',
        auth: { username: "muneeb", password: "theshining" }
      })

search = async (text: string)=>{
        const res = await this.client.search({
            index: 'booking.hotel',
            body: {
              query: {
                wildcard: {personName:`*${text}*`,nic:`*${text}*`,roomNumber:`*${text}*`}
              }
            }
          })
          return res
    }

searchExact = async (text: string)=>{
        const res = await this.client.search({
            index: 'booking.hotel',
            body: {
              query: {
                match: {personName:`${text}`,nic:`${text}`,roomNumber:`${text}`}
              }
            }
          })
          return res
    }
    }