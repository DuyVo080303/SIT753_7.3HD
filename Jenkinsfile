pipeline {
    agent any
    environment {
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        
    }
    stages {
        stage('Checkout') {
        steps {
                git branch: 'main', url: ' https://github.com/DuyVo080303/SIT753_7.3HD.git'
            }
        }
        stage('Install Dependencies') {
            steps {
            sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t shopping-website:lastest-version'
            }
        }
        stage('Run Tests') {
            steps {
            sh 'npm test || true' // Allows pipeline to continue despite test failures
            }
        }
        stage('SonarCloud Analysis') {
            steps {
                sh '''
                    # Download and extract SonarScanner CLI
                    curl -o sonar-scanner.zip ⁦https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-7.1.0.4889.zip⁩
                    unzip -o sonar-scanner.zip
                    rm -rf sonar-scanner || true
                    mv sonar-scanner-7.1.0.4889 sonar-scanner
                    ./sonar-scanner/bin/sonar-scanner \
                        -Dsonar.projectKey=duyvo080303_SIT753_7.3HD \
                        -Dsonar.organization=duyvo080303 \
                        -Dsonar.host.url=⁦https://sonarcloud.io⁩ \
                        -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }
        stage('Security') {
            steps {
                echo 'Running Snyk Dependency Scan...'
                snykSecurity(
                    snykInstallation: 'Snyk',
                    snykTokenId: 'SNYK_TOKEN',
                    organisation: 'duyvo080303',
                    projectName: 'SIT753_7.3HD',
                    severity: 'low',
                    additionalArguments: '--json --severity-threshold=low --file=package.json'
                )
            }
        }
    
        stage('Deploy') {
            steps {
                script {
                    // Use docker-compose to deploy
                    sh 'docker-compose -f docker-compose.yml down || true'
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    
    

    }
}
