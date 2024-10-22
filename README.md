<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&color=4E1764"/>

# Project Surgical Appointment and Resource Management

## 1. Description of the Project

As part of the LEI ([Licenciatura Engenharia Informática](https://www.isep.ipp.pt/Course/Course/26)) degree's integrative project at ISEP ([Instituto Superior de Engenharia do Porto](https://www.isep.ipp.pt)) for the 2024/2025 academic year, we are embarking on a project to develop a prototype system for surgical requests, appointment, and resource management. The system will enable hospitals and clinics to manage surgery appointments and patient records. It will also offer real-time 3D visualization of resource availability within the facility and optimize scheduling and resource usage. Furthermore, the project will address GDPR compliance, ensuring the system meets data protection and consent management requirements.

## 2. Planning and Technical Documentation

[_`Planning and Technical Documentation`_](docs/readme.md)

## 3. How to Build

To build the Surgical Appointment and Resource Management system, follow these steps:

1. Ensure you have the .NET SDK installed on your machine. You can download it from the official [.NET website](https://dotnet.microsoft.com/download).
2. Open a terminal or command prompt.
3. Navigate to the root directory of the project.
4. Run the following command to restore the project dependencies:

    ```sh
    dotnet restore
    ```

5. Build the project using:

    ```sh
    dotnet build
    ```

6. If the build is successful, the output binaries will be available in the `bin` directory.

## 4. How to Run

To run the Surgical Appointment and Resource Management system:

1. Run the following command to start the application with the HTTPS profile:

    ```sh
    dotnet run --launch-profile https
    ```

2. The application will start, and you will see output indicating that the server is running. By default, it will be accessible at `https://localhost:5001`.
3. A web browser will automatically open and navigate to the appropriate URL to interact with the application.

**Note:** Currently, we are using Swagger for API documentation and testing. You can access the Swagger UI at `https://localhost:5001/swagger` once the application is running.

## 5. How to Execute Tests

To execute tests for the Surgical Appointment and Resource Management system:

1. Run the following command to execute the tests:

    ```sh
    dotnet test
    ```
    
2. The test results will be displayed in the terminal or command prompt. You can also configure the test runner to generate test reports in various formats.

## 6. How to Execute Postman Tests

To run Postman tests for the Surgical Appointment and Resource Management system:

1. Ensure you have [Postman](https://www.postman.com/downloads/) installed on your machine.
2. Open Postman and access our shared workspace. You will need an invitation to join the workspace.
3. Make sure the application is running. Refer to the [How to Run](#4-how-to-run) section for instructions.
4. In Postman, navigate to the shared workspace and select the relevant collection.
5. Click on the "Run" button to execute all the requests in the collection.
6. Postman will display the results of each request, including any assertions and test results.


<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&color=4E1764&section=footer"/>
