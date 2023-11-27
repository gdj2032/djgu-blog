interface IDemo {
  'status': string;
  'data': {
   'resultType': string;
   'result': {
     'metric': {
      'instance': string;
     }
     'values': number[][];
   }[]
  }
}