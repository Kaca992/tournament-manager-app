import { CompetitorAllocatorEnum, ICompetitorAllocator } from "./competitorAllocator";
import { SnakeTableAllocator } from "./table/snakeTableAllocator";

type CompetitorAllocatorTypes = SnakeTableAllocator;

export default class CompetitorAllocatorFactory {
    public static GetCompetitorAllocator(type: CompetitorAllocatorEnum, settings?: any): CompetitorAllocatorTypes {
        switch (type) {
            case CompetitorAllocatorEnum.SnakeTableAllocator:
                return new SnakeTableAllocator(settings);
        }
    }
}
