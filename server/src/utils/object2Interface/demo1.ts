interface IDemo {
  '15374472546503429': {
    'apiVersion': string;
    'kind': string;
    'metadata': {
     'annotations': {
      'cni.projectcalico.org/containerID': string;
      'cni.projectcalico.org/podIP': string;
      'cni.projectcalico.org/podIPs': string;
      'kubernetes.io/psp': string;
      'note': string;
     }
     'creationTimestamp': string;
     'generateName': string;
     'labels': {
      'deployment': string;
      'org': string;
      'pod-template-hash': string;
      'variant': string;
     }
     'managedFields': {
       'apiVersion': string;
       'fieldsType': string;
       'fieldsV1': {
        'f:metadata': {
         'f:annotations': {
          'f:cni.projectcalico.org/containerID': Object
          'f:cni.projectcalico.org/podIP': Object
          'f:cni.projectcalico.org/podIPs': Object
         }
        }
       }
       'manager': string;
       'operation': string;
       'subresource': string;
       'time': string;
     }[]
     'name': string;
     'namespace': string;
     'ownerReferences': {
       'apiVersion': string;
       'kind': string;
       'name': string;
       'uid': string;
     }[]
     'resourceVersion': string;
     'uid': string;
    }
    'spec': {
     'containers': {
       'envFrom': {
         'configMapRef': {
          'name': string;
         }
       }[]
       'image': string;
       'imagePullPolicy': string;
       'name': string;
       'ports': {
         'containerPort': number;
         'protocol': string;
       }[]
       'resources': {
        'limits': {
         'cpu': string;
         'memory': string;
        }
        'requests': {
         'cpu': string;
         'memory': string;
        }
       }
       'terminationMessagePath': string;
       'terminationMessagePolicy': string;
       'volumeMounts': {
         'mountPath': string;
         'name': string;
       }[]
     }[]
     'dnsPolicy': string;
     'nodeName': string;
     'preemptionPolicy': string;
     'priority': number;
     'restartPolicy': string;
     'schedulerName': string;
     'securityContext': Object
     'serviceAccount': string;
     'serviceAccountName': string;
     'terminationGracePeriodSeconds': string;
     'tolerations': {
       'effect': string;
       'key': string;
       'operator': string;
       'tolerationSeconds': string;
     }[]
     'volumes': {
       'name': string;
       'projected': {
        'defaultMode': number;
        'sources': {
          'serviceAccountToken': {
           'expirationSeconds': string;
           'path': string;
          }
        }[]
       }
     }[]
    }
    'status': {
     'conditions': {
       'lastTransitionTime': string;
       'status': string;
       'type': string;
     }[]
     'containerStatuses': {
       'containerID': string;
       'image': string;
       'imageID': string;
       'lastState': Object
       'name': string;
       'restartCount': number;
       'state': {
        'running': {
         'startedAt': string;
        }
       }
     }[]
     'hostIP': string;
     'phase': string;
     'podIP': string;
     'podIPs': {
       'ip': string;
     }[]
     'qosClass': string;
     'startTime': string;
    }
  }[]
}