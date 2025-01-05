import { Container } from 'typedi';
import LoggerInstance from './logger';

export default ({ mongoConnection, schemas, controllers, repos, services }: {
    mongoConnection;
    schemas: { name: string; schema: any }[],
    controllers: { name: string; path: string }[],
    repos: { name: string; path: string }[],
    services: { name: string; path: string }[]
}) => {
    try {
        Container.set('logger', LoggerInstance);

        schemas.forEach(m => {
            let schema = require(m.schema).default;
            Container.set(m.name, schema);
        });

        repos.forEach(m => {
            let repoClass = require(m.path).default;
            let repoInstance = new repoClass(); // Instantiate the repo class
            Container.set(m.name, repoInstance);
        });

        services.forEach(m => {
            let serviceClass = require(m.path).default;
            let serviceInstance = new serviceClass(); // Instantiate the service class
            Container.set(m.name, serviceInstance);
        });

        controllers.forEach(m => {
            let controllerClass = require(m.path).default;
            let controllerInstance = new controllerClass(); // Instantiate the controller class
            Container.set(m.name, controllerInstance);
        });

        return;
    } catch (e) {
        console.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
