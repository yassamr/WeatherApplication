pipeline {
    agent any
    environment {
        INSTANCE_IP = '192.168.1.74' // IP publique de weather-instance2
        WEB_ROOT = '/var/www/html' // Dossier cible sur l'instanc
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/yassamr/WeatherApplication.git'
            }
        }
        stage('Deploy to OpenStack') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_KEY_USR')]) {
                    sh '''
                    # Vérifier la présence des fichiers
                    ls -l index.html script.js style.css
                    # Copier les fichiers vers l'instance OpenStack
                    scp -o StrictHostKeyChecking=no -i ${SSH_KEY} index.html script.js style.css ${SSH_KEY_USR}@${INSTANCE_IP}:${WEB_ROOT}/
                    # Ajuster les permissions et redémarrer Nginx
                    ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${SSH_KEY_USR}@${INSTANCE_IP} "
                        sudo chown -R www-data:www-data ${WEB_ROOT}
                        sudo chmod -R 755 ${WEB_ROOT}
                        sudo systemctl restart nginx
                    "
                    '''
                }
            }
        }
    }
    post {
        always {
            cleanWs() // Nettoyer l'espace de travail
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}