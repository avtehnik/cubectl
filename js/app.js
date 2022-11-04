var vueApp = new Vue({
    el: '#vue-app',
    data: {
        input: "",
        namespace: "development",
        podId: "",
        commandTemplates: [
            {
                title: 'Pods',
                func: function(podId, namespace) {
                    return 'kubectl get pods -o wide -n ' + namespace;
                },
                commands: [
                    function(podId, namespace) {
                        return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- bash';
                    },
                    function(podId, namespace) {
                        return 'kubectl delete pod ' + podId + ' -n ' + namespace;
                    },
                    function(podId, namespace) {
                        return 'kubectl top pod ' + podId + ' -n ' + namespace;
                    },
                    function(podId, namespace) {
                        return 'kubectl describe pods ' + podId + ' -n ' + namespace;
                    },
                    function(podId, namespace) {
                        return 'kubectl describe PodMetrics ' + podId + ' -n ' + namespace;
                    },
                    function(podId, namespace) {
                        return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- env';
                    },
                    function(podId, namespace) {
                        return 'kubectl logs -f ' + podId + ' -n ' + namespace;
                    },
                    function(podId, namespace) {
                        return 'kubectl get pod ' + podId + ' -n ' + namespace + ' -o yaml';
                    }
                ]

            },
            {
                title: 'curl from pod',
                params: {'url': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl exec -n ' + namespace + ' -it ' + podId + ' -- curl ' + values['url'];
                }
            },
            {
                title: 'set namespace',
                params: {'url': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl config set-context --current --namespace=' + namespace;
                }
            },
            {
                title: 'upload file to pod',
                params: {'from': 'test.php', 'to': '/srv/project/public/'},
                func: function(podId, namespace, values) {
                    return 'kubectl cp ' + values['from'] + ' ' + namespace + '/' + podId + ':' + values['to'];
                }
            },
            {
                title: 'download file from pod',
                params: {'from': 'test.php', 'to': '.'},
                func: function(podId, namespace, values) {
                    return 'kubectl cp ' + namespace + '/' + podId + ':' + values['from'] + ' ' + values['to'];
                }
            },
            {
                title: 'port-forward',
                params: {'locahost-port': '5434', 'pod-port': '5434'},
                func: function(podId, namespace, values) {
                    return 'kubectl port-forward ' + podId + ' -n ' + namespace + ' ' + values['locahost-port'] + ':' + values['pod-port']
                }
            },
            {
                title: 'Horizontal pod autoscaler',
                params: {'secret': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl get hpa -n ' + namespace
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl edit hpa ' + values['secret'] + ' -n ' + namespace;
                    }
                ]
            },
            {
                title: 'Replica set',
                func: function(podId, namespace, values) {
                    return 'kubectl get rs -n ' + namespace
                }
            },
            {
                title: 'Secrets',
                params: {'secret': ''},
                func: function(podId, namespace) {
                    return 'kubectl get secret -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl edit secret ' + values['secret'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl get secret ' + values['secret'] + ' -n ' + namespace + ' -o yaml';
                    },
                    function(podId, namespace, values) {
                        return 'kubectl delete secret ' + values['secret'] + ' -n ' + namespace;
                    }
                ]

            },
            {
                title: 'Deployments',
                params: {'deployment': 'auth', 'image': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl get deployments -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl exec -it deployment/' + values['deployment'] + ' -n ' + namespace +' -- bash';
                    },
                    function(podId, namespace, values) {
                        return 'kubectl edit deployment/' + values['deployment'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl rollout restart deployment/' + values['deployment'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl rollout  status -w deployment/' + values['deployment'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl get deployment/' + values['deployment'] + ' -n ' + namespace + ' -o yaml';
                    },
                    function(podId, namespace, values) {
                        return 'kubectl get deployments -n ' + namespace + ' -o json | jq " .items[].spec.template.spec.containers[0] | {name: .name, image:.image}"';
                    },
                    function(podId, namespace, values) {
                        return 'kubectl scale deployment/' + values['deployment'] + ' -n ' + namespace + ' --replicas=7';
                    },
                    function(podId, namespace, values) {
                        return 'kubectl set image deployment/' + values['deployment'] + '  ' + values['deployment'] + '=' + values['image'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl delete deployment ' + values['deployment'] + ' -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl describe deployment ' + values['deployment'] + ' -n ' + namespace;
                    }
                ]
            },
            {
                title: 'Services',
                params: {'service': 'auth'},
                func: function(podId, namespace, values) {
                    return 'kubectl get services -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl get service/' + values['service'] + ' -n ' + namespace + ' -o yaml';
                    }
                ]
            },
            {
                title: 'Events',
                params: {'service': 'auth'},
                func: function(podId, namespace, values) {
                    return 'kubectl get events --field-selector type!=Normal -A --sort-by=\'.metadata.creationTimestamp\' -n ' + namespace;
                },
                // commands: [
                //     function(podId, namespace, values) {
                //         return 'kubectl get service/' + values['service'] + ' -n ' + namespace + ' -o yaml';
                //     }
                // ]
            },
            {
                title: 'Persistent Volume Claim',
                params: {'volumeClaim': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl get pvc -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl get pvc ' + values['volumeClaim'] + ' -n ' + namespace + ' -o yaml';
                    }
                ]
            },
            {
                title: 'Persistent Volume',
                params: {'volume': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl get pv -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl get pv ' + values['volume'] + ' -n ' + namespace + ' -o yaml';
                    }
                ]
            },
            {
                title: 'Config Map',
                params: {'configmap': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl get configmap -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl get configmap ' + values['configmap'] + ' -n ' + namespace + ' -o yaml';
                    }
                ]
            },
            {
                title: 'Namespace',
                params: {'namespace': 'development'},
                func: function(podId, namespace, values) {
                    return 'kubectl get namespace';
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl create namespace ' + values['namespace'];
                    },
                    function(podId, namespace, values) {
                        return 'kubectl delete namespace ' + values['namespace'];
                    }
                ]
            },
            {
                title: 'Jobs',
                params: {'job': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl get jobs -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl get jobs -n ' + namespace + ' -o json | jq " .items[].spec.template.spec.containers[0] | {name: .name, image:.image}"';
                    },
                    function(podId, namespace, values) {
                        return 'kubectl get job ' + values['job'] + '  -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl edit job ' + values['job'] + '  -n ' + namespace;
                    }
                ]
            },
            {
                title: 'CronJob',
                params: {'cronjob': ''},
                func: function(podId, namespace, values) {
                    return 'kubectl get cronjob -n ' + namespace;
                },
                commands: [
                    function(podId, namespace, values) {
                        return 'kubectl get cronjob ' + values['cronjob'] + '  -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl get cronjob ' + values['cronjob'] + '  -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl patch cronjobs '+values['cronjob']+' -p \'{"spec" : {"suspend" : true }}\'  -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl patch cronjobs '+values['cronjob']+' -p \'{"spec" : {"suspend" : false }}\'  -n ' + namespace;
                    },
                    function(podId, namespace, values) {
                        return 'kubectl edit cronjob ' + values['cronjob'] + '  -n ' + namespace;
                    }
                ]
            }
        ]
    },
    methods: {
        copy: function(cmd) {
            navigator.clipboard.writeText(cmd);
        },
        selectNS: function(cmd, ns) {
            this.namespace = ns;
            navigator.clipboard.writeText(cmd + ns);
        },
        update: function() {
            let parts = this.input.split(/[ ]+/).map(function(item) {
                return item.trim();
            })

            this.namespace = parts[0];
            this.podId = parts[1];
        }
    },
    beforeMount() {
    },
    computed: {
        commands: function() {
            var t = this;
            return this.commandTemplates.map(function(template) {
                return {
                    title: template.title,
                    params: template.hasOwnProperty('params') ? Object.keys(template.params) : [],
                    command: template.func(t.podId, t.namespace, template.params),
                    commands: template.hasOwnProperty('commands') ? template.commands.map(function(func) {
                        return func(t.podId, t.namespace, template.params);
                    }) : [],
                }
            })
        },
    }
});

document.body.addEventListener("keydown", function(e) {
    if ((e.metaKey || e.ctrlKey) && e.code === 'KeyV') {
        navigator.clipboard.readText()
            .then(text => {
                // vueApp.podId = text;
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    }
}, false);
