import { OvaRepository } from '../../../../domain/repository/ova.repository';
import { SqliteOvaDataSource } from '../../../../infrastructure/datasources/sqlite-ova.datasource';
import { OvaRepositoryImpl } from '../../../../infrastructure/repositories/ova.repositories.impl';

const collator = (a: string, b: string) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

export class OvasModel {
    private static readonly repository: OvaRepository = new OvaRepositoryImpl(new SqliteOvaDataSource());

    static async getAllOvas(name?: string) {
        const ovas = await this.repository.get();
        const term = name?.trim().toLowerCase();
        const filtered = term ? ovas.filter(ova => ova.name.toLowerCase().includes(term)) : ovas;
        return filtered.sort((a, b) => collator(a.name, b.name));
    }

    static async getAllOvaGroups() {
        const ovas = await this.repository.get();
        // Extraer los grupos de OVA únicos
        return Array.from(new Set(ovas.map(ova => ova.parentFolder)))
            .sort((a, b) => collator(a ?? '', b ?? ''));
    }

    static async getOvaById(id: string) {
        const ovas = await this.repository.get();
        return ovas.find(ova => ova.id === id);
    }
}
