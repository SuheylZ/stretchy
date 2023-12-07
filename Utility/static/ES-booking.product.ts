import { Client } from "@elastic/elasticsearch" //run npm i @elastic/elasticsearch

export default class Es_booking_product {
        client = new Client({
        node: 'http://localhost:9200',
        auth: { username: "muneeb", password: "theshining" }
      })

search = async (text: string)=>{
        const res = await this.client.search({
            index: 'booking.product',
            body: {
              query: {
                wildcard: {title:`*${text}*`,from:`*${text}*`}
              }
            }
          })
          return res
    }

searchExact = async (text: string)=>{
        const res = await this.client.search({
            index: 'booking.product',
            body: {
              query: {
                match: {title:`${text}`,from:`${text}`}
              }
            }
          })
          return res
    }
    }