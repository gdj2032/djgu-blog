interface IDemo {
  'code': number;
  'msg': string;
  'result': {
    'runName': string;
    'runStatus': string;
    'gpu': string;
    'costTime': number;
    'runId': string;
    'pipeline_name': string;
  }[]
}