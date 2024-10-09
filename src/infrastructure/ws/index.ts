import WebSocket, { WebSocketServer } from 'ws'
import { type Server } from 'http'
import { SearchService } from '../../core/services/search.service'
import { FactoryRepos } from '../db/repositories'
import 'dotenv/config.js'

export class WS {
  private wss: WebSocket.Server
  constructor(
    private readonly server: Server,
    private readonly searchService = new SearchService(
      FactoryRepos.getOrganizationRepository(),
      FactoryRepos.getPostRepository(),
    ),
  ) {
    this.wss = new WebSocketServer({ server })
    this.init()
  }

  init() {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', async (mData: WebSocket.RawData) => {
        const data: { text: string } = JSON.parse(mData.toString())
        if (data['text']) {
          const responseData = await this.searchService.globalSearch(data.text)
          ws.send(JSON.stringify(responseData))
        }
      })

      ws.on('close', () => {
        console.log('WS :: Клиент отключен')
      })

      ws.on('error', () => {
        console.log('WS :: Ошибка')
      })
    })
  }

  close() {
    this.wss.close()
  }
}
