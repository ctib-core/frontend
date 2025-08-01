
// ai agents
// blockchain data
// 
export interface IAgent {
  name: string,
  id: number,
  tags: string[],
  desc: string,
  icon: string,
  img: string, // one image url
  successRate: number,
  cyles: {
    pages: number,
  },
  cpu: number // %
  totalSimulations: number,
}

// export 