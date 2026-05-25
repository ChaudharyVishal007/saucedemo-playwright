pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.49.1-noble'
            // Run as root inside the container to avoid npm/file permission restrictions
            args '-u root --entrypoint=""'
        }
    }

    environment {
        CI = 'true'
        // Define Playwright environment variables matching .env.example
        BASE_URL = 'https://www.saucedemo.com'
        STANDARD_USER = 'standard_user'
        LOCKED_USER = 'locked_out_user'
        PROBLEM_USER = 'problem_user'
        PERFORMANCE_USER = 'performance_glitch_user'
        PASSWORD = 'secret_sauce'
        ENV = 'staging'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout source code from SCM (Git)
                checkout scm
            }
        }

        stage('Environment Setup') {
            steps {
                echo 'Preparing environment variables...'
                // Create .env file for the framework from .env.example if needed
                sh 'cp .env.example .env'
                
                echo 'Installing lightweight Java JRE inside Playwright container for Allure reporting...'
                // Allure CLI requires Java (JRE) to run inside the container
                sh 'apt-get update && apt-get install -y openjdk-17-jre-headless'
                
                echo 'System Information:'
                sh 'node -v'
                sh 'npm -v'
                sh 'java -version'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing node modules via npm ci...'
                // Use --legacy-peer-deps to bypass strict peer dependency version checks (e.g. allure-playwright matching older Playwright versions)
                sh 'npm ci --legacy-peer-deps'
            }
        }

        stage('Execute Tests') {
            steps {
                echo 'Running Playwright Automation Suite...'
                // Run tests and output Allure results
                // We use 'sh' inside try-catch or catchError to ensure reports are generated even if tests fail
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'npm run test:ci'
                }
            }
        }

        stage('Generate Reports') {
            steps {
                echo 'Generating Allure 3 Rich HTML Report...'
                // Generate the static Allure HTML report from raw allure-results
                sh 'npm run allure:generate'
            }
        }
    }

    post {
        always {
            echo 'Archiving test artifacts and publishing Allure Report...'
            
            // 1. Publish Allure Report using the Allure Jenkins Plugin
            // This displays a beautifully integrated "Allure Report" widget on the build page
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            
            // 2. Archive both Allure Report and Playwright Report as standard Jenkins artifacts
            // This acts as a reliable fallback if the Allure plugin is not installed
            archiveArtifacts artifacts: 'allure-report/**, playwright-report/**, test-results/**', allowEmptyArchive: true
            
            // 3. Clean up the workspace to keep the agent host lightweight
            cleanWs()
        }
    }
}
