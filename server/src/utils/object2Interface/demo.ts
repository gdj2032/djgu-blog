export const objectDemo = {
  "15374472546503429": [
    {
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
        "annotations": {
          "cni.projectcalico.org/containerID": "944ceb707625a9a419d98725f3598f732a4043de2aed1c84282b0f0326777978",
          "cni.projectcalico.org/podIP": "10.42.113.230/32",
          "cni.projectcalico.org/podIPs": "10.42.113.230/32",
          "kubernetes.io/psp": "global-unrestricted-psp",
          "note": "Hello, I am dev!"
        },
        "creationTimestamp": "2023-11-07T11:35:18Z",
        "generateName": "arithmetic-core-7b69bb856d-",
        "labels": {
          "deployment": "arithmetic-core",
          "org": "tmind",
          "pod-template-hash": "7b69bb856d",
          "variant": "dev"
        },
        "managedFields": [
          {
            "apiVersion": "v1",
            "fieldsType": "FieldsV1",
            "fieldsV1": {
              "f:metadata": {
                "f:annotations": {
                  "f:cni.projectcalico.org/containerID": {},
                  "f:cni.projectcalico.org/podIP": {},
                  "f:cni.projectcalico.org/podIPs": {}
                }
              }
            },
            "manager": "calico",
            "operation": "Update",
            "subresource": "status",
            "time": "2023-11-07T11:35:18Z"
          },
          {
            "apiVersion": "v1",
            "fieldsType": "FieldsV1",
            "fieldsV1": {
              "f:metadata": {
                "f:annotations": {
                  ".": {},
                  "f:note": {}
                },
                "f:generateName": {},
                "f:labels": {
                  ".": {},
                  "f:deployment": {},
                  "f:org": {},
                  "f:pod-template-hash": {},
                  "f:variant": {}
                },
                "f:ownerReferences": {
                  ".": {},
                  "k:{\"uid\":\"00ab4740-1951-414e-a9d6-52f9db409b1c\"}": {}
                }
              },
              "f:spec": {
                "f:containers": {
                  "k:{\"name\":\"arithmetic-core\"}": {
                    ".": {},
                    "f:envFrom": {},
                    "f:image": {},
                    "f:imagePullPolicy": {},
                    "f:name": {},
                    "f:ports": {
                      ".": {},
                      "k:{\"containerPort\":8080,\"protocol\":\"TCP\"}": {
                        ".": {},
                        "f:containerPort": {},
                        "f:protocol": {}
                      }
                    },
                    "f:resources": {
                      ".": {},
                      "f:limits": {
                        ".": {},
                        "f:cpu": {},
                        "f:memory": {}
                      },
                      "f:requests": {
                        ".": {},
                        "f:cpu": {},
                        "f:memory": {}
                      }
                    },
                    "f:terminationMessagePath": {},
                    "f:terminationMessagePolicy": {}
                  }
                },
                "f:dnsPolicy": {},
                "f:enableServiceLinks": {},
                "f:restartPolicy": {},
                "f:schedulerName": {},
                "f:securityContext": {},
                "f:terminationGracePeriodSeconds": {}
              }
            },
            "manager": "kube-controller-manager",
            "operation": "Update",
            "time": "2023-11-07T11:35:18Z"
          },
          {
            "apiVersion": "v1",
            "fieldsType": "FieldsV1",
            "fieldsV1": {
              "f:status": {
                "f:conditions": {
                  "k:{\"type\":\"ContainersReady\"}": {
                    ".": {},
                    "f:lastProbeTime": {},
                    "f:lastTransitionTime": {},
                    "f:status": {},
                    "f:type": {}
                  },
                  "k:{\"type\":\"Initialized\"}": {
                    ".": {},
                    "f:lastProbeTime": {},
                    "f:lastTransitionTime": {},
                    "f:status": {},
                    "f:type": {}
                  },
                  "k:{\"type\":\"Ready\"}": {
                    ".": {},
                    "f:lastProbeTime": {},
                    "f:lastTransitionTime": {},
                    "f:status": {},
                    "f:type": {}
                  }
                },
                "f:containerStatuses": {},
                "f:hostIP": {},
                "f:phase": {},
                "f:podIP": {},
                "f:podIPs": {
                  ".": {},
                  "k:{\"ip\":\"10.42.113.230\"}": {
                    ".": {},
                    "f:ip": {}
                  }
                },
                "f:startTime": {}
              }
            },
            "manager": "kubelet",
            "operation": "Update",
            "subresource": "status",
            "time": "2023-11-08T01:32:15Z"
          }
        ],
        "name": "arithmetic-core-7b69bb856d-6d8qm",
        "namespace": "zju-mlops-dev",
        "ownerReferences": [
          {
            "apiVersion": "apps/v1",
            "kind": "ReplicaSet",
            "blockOwnerDeletion": true,
            "controller": true,
            "name": "arithmetic-core-7b69bb856d",
            "uid": "00ab4740-1951-414e-a9d6-52f9db409b1c"
          }
        ],
        "resourceVersion": "350760793",
        "uid": "75dbf83b-a034-4676-b27e-a1ecfdb3cc31"
      },
      "spec": {
        "containers": [
          {
            "envFrom": [
              {
                "configMapRef": {
                  "name": "arithmetic-core-properties-42k7f976cd"
                }
              }
            ],
            "image": "docker.int.tmindtech.com/zju-mlops/arithmetic-core:20231107111956_a15997",
            "imagePullPolicy": "IfNotPresent",
            "name": "arithmetic-core",
            "ports": [
              {
                "containerPort": 8080,
                "protocol": "TCP"
              }
            ],
            "resources": {
              "limits": {
                "cpu": "2",
                "memory": "4000Mi"
              },
              "requests": {
                "cpu": "0",
                "memory": "0"
              }
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "volumeMounts": [
              {
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount",
                "name": "kube-api-access-j88vj",
                "readOnly": true
              }
            ]
          }
        ],
        "dnsPolicy": "ClusterFirst",
        "enableServiceLinks": true,
        "nodeName": "bsc-k8s-cluster-worker-01",
        "preemptionPolicy": "PreemptLowerPriority",
        "priority": 0,
        "restartPolicy": "Always",
        "schedulerName": "default-scheduler",
        "securityContext": {},
        "serviceAccount": "default",
        "serviceAccountName": "default",
        "terminationGracePeriodSeconds": "30",
        "tolerations": [
          {
            "effect": "NoExecute",
            "key": "node.kubernetes.io/not-ready",
            "operator": "Exists",
            "tolerationSeconds": "300"
          },
          {
            "effect": "NoExecute",
            "key": "node.kubernetes.io/unreachable",
            "operator": "Exists",
            "tolerationSeconds": "300"
          }
        ],
        "volumes": [
          {
            "name": "kube-api-access-j88vj",
            "projected": {
              "defaultMode": 420,
              "sources": [
                {
                  "serviceAccountToken": {
                    "expirationSeconds": "3607",
                    "path": "token"
                  }
                },
                {
                  "configMap": {
                    "items": [
                      {
                        "key": "ca.crt",
                        "path": "ca.crt"
                      }
                    ],
                    "name": "kube-root-ca.crt"
                  }
                },
                {
                  "downwardAPI": {
                    "items": [
                      {
                        "fieldRef": {
                          "apiVersion": "v1",
                          "fieldPath": "metadata.namespace"
                        },
                        "path": "namespace"
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      },
      "status": {
        "conditions": [
          {
            "lastTransitionTime": "2023-11-07T11:35:18Z",
            "status": "True",
            "type": "Initialized"
          },
          {
            "lastTransitionTime": "2023-11-07T11:35:33Z",
            "status": "True",
            "type": "Ready"
          },
          {
            "lastTransitionTime": "2023-11-07T11:35:33Z",
            "status": "True",
            "type": "ContainersReady"
          },
          {
            "lastTransitionTime": "2023-11-07T11:35:18Z",
            "status": "True",
            "type": "PodScheduled"
          }
        ],
        "containerStatuses": [
          {
            "containerID": "containerd://bb6cb98a61530d25dc18169fcabedff0cec9b87b738de8600de2a8843b0a34f6",
            "image": "docker.int.tmindtech.com/zju-mlops/arithmetic-core:20231107111956_a15997",
            "imageID": "docker.int.tmindtech.com/zju-mlops/arithmetic-core@sha256:d1ac3372518caa248480de586b76cba89f948f2c55b46d69bcbab05bdfc17554",
            "lastState": {},
            "name": "arithmetic-core",
            "ready": true,
            "restartCount": 0,
            "started": true,
            "state": {
              "running": {
                "startedAt": "2023-11-07T11:35:33Z"
              }
            }
          }
        ],
        "hostIP": "192.168.1.56",
        "phase": "Running",
        "podIP": "10.42.113.230",
        "podIPs": [
          {
            "ip": "10.42.113.230"
          }
        ],
        "qosClass": "Burstable",
        "startTime": "2023-11-07T11:35:18Z"
      }
    }
  ],
  "15374472546372357": []
}