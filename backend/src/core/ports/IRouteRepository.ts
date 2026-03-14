// File: backend/src/core/ports/IRouteRepository.ts

import { RouteEntity } from "../domain/Route";

export interface IRouteRepository {
    findAll(): Promise<RouteEntity[]>;
    findById(id: string): Promise<RouteEntity | null>;
    setBaseline(id: string): Promise<void>;
    getBaseline(): Promise<RouteEntity | null>;
}