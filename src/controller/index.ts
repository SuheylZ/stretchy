import { Client, ClientOptions } from "@elastic/elasticsearch"
import { readFileSync, writeFileSync } from "fs"
import path, { join } from "path"
import YAML from 'yaml'
import fs from 'fs';
const host: string = 'http://localhost:9200'
const username: string = 'muneeb'
const password: string = 'theshining'

export enum Lang {
    TypeScript = 'ts',
    CSharp = 'c#'
} 

const client = new Client({
    node: host,
    auth: { username: username, password: password }
  })

export async function createIdx<TDocument>(idxName: string, doc: TDocument) {
    await client.index({
        index: idxName,
        document:doc,
      })
}

export async function createIdxBulk<TDocument>(idxName: string, docs: TDocument[]) {
    for(const d of docs){
      await client.index({
        index: idxName,
        document: d
      })
    }
}

function syncWriteFile(filename: string, data: any) {

  // Specify the directory where uploaded files will be stored
const uploadDirectory = path.join(__dirname ,'../static/');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    writeFileSync(join(__dirname,'../static', filename), data, {
      flag: 'w',
    });
  }

  function readFile(filename: string){
    const contents = readFileSync(join(__dirname,'../uploads' ,filename), 'utf-8');
    // console.log(contents); // 👉️ "One Two Three Four"
  
    return contents;
  }

const typescriptContent = () => {
    let content: string = ''
    const importArr: string[] = ['import { Client } from "@elastic/elasticsearch" //run npm i @elastic/elasticsearch'] 
    const imports: string = importArr.join('\n')
    const esClient = `client = new Client({
        node: '${host}',
        auth: { username: "${username}", password: "${password}" }
      })`
    const searchMethod = `search = async (text: string)=>{
        const res = await this.client.search({
            index: '<idxName>',
            body: {
              query: {
                wildcard: <querywild>
              }
            }
          })
          return res
    }`
    const searchExactMethod = `searchExact = async (text: string)=>{
        const res = await this.client.search({
            index: '<idxName>',
            body: {
              query: {
                match: <queryexact>
              }
            }
          })
          return res
    }`
    
    
    content += imports
    content += '\n\n'
    let classContent = ``
    classContent += esClient
    classContent += '\n\n'
    classContent += searchMethod
    classContent += '\n\n'
    classContent += searchExactMethod
    // const className = idxName.replaceAll('-','_')
    const idxClass = `export default class Es_<className> {
        ${classContent}
    }`
    content += idxClass
    return content
}

export const generateFileContent = (idxName: string, types: string[], lang: Lang)=>{
    let content: string = ''
    let filename: string = 'testFile'
    let fileExt: string = ''
    switch (lang) {
        case Lang.TypeScript:
            fileExt = 'ts'
            filename = `ES-${idxName}`
            let q: string = '{';
            let arr: string[] = []
            for(const t of types){
                const a =  t + ":" + '`*${text}*`'
                arr.push(a)
                //q += a
            }
            q += arr.join(',')
            q += '}'
        
            const className = idxName.replaceAll('-','_').replaceAll('.', '_')
            content = typescriptContent()
            content = content.replaceAll('<idxName>',idxName)
                .replaceAll('<querywild>',q)
                .replaceAll('<queryexact>',q.replaceAll('*',''))
                .replace('<className>',className)
                    
            break;    
        default:
            filename = 'notSupported'
            fileExt = 'txt'
            content = 'language not supported yet.'
            break;
    }

    syncWriteFile(`../static/${filename}.${fileExt}`, content)
    return `${filename}.${fileExt}`
}
export type document = {
  indices: index[]
}
export type index = {
  name: string
  fields: field[]
} 
export type field = {
  name: string
  type: string
}
export const __readYAMLFile__ = (filename: string, docNames: string[]) => {
  try {
    console.log('reading file: ', filename)
    const file = readFile(filename)
    console.log('parsing yaml...')
    const data = YAML.parse(file)
    
    for(const docName of docNames){
      const doc: document = data[docName]
      if(!doc){
        console.log('doc not found: ', docName)
        return
      }
      const indices: index[] = doc.indices 
      for(const idx of indices){
        generateFileContent(`${docName}.${idx.name}`, idx.fields.map(x => x.name), Lang.TypeScript)
      }
    }
    console.log(`completed.`)
  } catch (error) {
    console.log('Exception: ', error)
  }

}

//__MAIN__
// (async ()=>{
//   __readYAMLFile__('./../static/sample.yaml', ['booking', 'trips'])  
//   // readJSYAML('./../static/sample.yaml')  
// })()
