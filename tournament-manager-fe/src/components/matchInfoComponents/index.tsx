import * as React from 'react';
import { MatchInfoTypeEnum } from "../../common/enums";
import TableTennisMatchInfos from "./tableTennisMatchInfo/tableTennisMatchInfos";

export function getMatchInfoComponent(matchInfoType: MatchInfoTypeEnum, matchSettings: any) {
    let Component;
    switch (matchInfoType) {
        case MatchInfoTypeEnum.TableTennisTournament:
            Component = TableTennisMatchInfos;
    }

    return <Component {...matchSettings} />;
}
