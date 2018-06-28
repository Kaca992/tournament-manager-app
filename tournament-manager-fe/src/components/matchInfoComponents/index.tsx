import * as React from 'react';
import { CompetitionTypeEnum } from "../../common/enums";
import TableTennisMatchInfos from "./tableTennisMatchInfo/tableTennisMatchInfos";

export function getMatchInfoComponent(competitionType: CompetitionTypeEnum, matchSettings: any) {
    switch (competitionType) {
        case CompetitionTypeEnum.TableTennisTournament:
            return TableTennisMatchInfos;
        default:
            throw new Error("Match info for this competition type is not defined!");
    }
}
