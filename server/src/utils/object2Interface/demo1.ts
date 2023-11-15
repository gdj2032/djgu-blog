interface IDemo {
  'models': {
    'id': string;
    'model': {
     'id': string;
     'name': string;
     'description': string;
     'status': number;
     'projectId': string;
     'creator': string;
     'createTime': string;
     'updater': string;
     'updateTime': string;
     'tags': {
       'id': string;
       'name': string;
     }[]
    }
    'modelVersion': string;
    'distributeTrainingId': string;
  }[]
}