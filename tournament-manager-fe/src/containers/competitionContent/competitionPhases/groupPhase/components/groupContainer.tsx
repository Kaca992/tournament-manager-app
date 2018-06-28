import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';
import { ICompetitionPhaseBaseCompetitor } from 'data_structures/competition.phase';
import { IMatchInfo } from '../../../../../common/matchInfos';
import { ICustomTableHeader } from '../../../../../components/customTable/customTable.utils';
import { CompetitionTypeEnum } from 'enums';
import { Header } from 'semantic-ui-react';
import * as _ from 'lodash';
import CustomTable from '../../../../../components/customTable/customTable';
import { getMatchInfoComponent } from '../../../../../components/matchInfoComponents';

export interface IGroupContainerProps {
    groupIndex: number;
    competitionType: CompetitionTypeEnum;
    competitors: ICompetitionPhaseBaseCompetitor[];
    matches: IMatchInfo[];
    tableHeaders: ICustomTableHeader[];

    onSaveMatchInfo(newMatchInfo: IMatchInfo, removeMatch: boolean);
}

export interface IGroupContainerState {

}

export default class GroupContainer extends React.Component<IGroupContainerProps, IGroupContainerState> {
    constructor(props: IGroupContainerProps) {
        super(props);

    }

    public shouldComponentUpdate(nextProps: IGroupContainerProps): boolean {
        const {competitors, matches} = this.props;
        if (!competitors || !matches) {
            console.log("Inicijalno stanje");
            return true;
        }

        // don't update component if competitors and matches didnt change
        return !(_.isEqual(competitors, nextProps.competitors) && _.isEqual(matches, nextProps.matches));
    }

    public render() {
        const { competitionType, tableHeaders, matches, competitors, groupIndex, onSaveMatchInfo } = this.props;
        return <div className='competition-group'>
            <Header as='h2'> Grupa {groupIndex + 1} </Header>
            <CustomTable
                headers={tableHeaders}
                data={competitors}
            />

            <div className='competition-group-schedule_container'>
                {getMatchInfoComponent(competitionType, { competitors, matches, onSaveMatchInfo })}
            </div>
        </div>;
    }
}
