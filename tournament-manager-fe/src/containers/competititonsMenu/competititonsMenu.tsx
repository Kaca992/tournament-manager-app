import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './competititonsMenu.scss';
import { ICompetition, ICategory } from '../../common/dataStructures';
import { Container, Header, Loader, List, Icon, Segment, Menu, Dropdown, Popup, Button } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { CompetitionStructureDuck } from '../../ducks/competition.structure.duck';

export interface ICompetititonsMenuContainerProps {
    selectedCompetitionId: number;
    categories: ICategory[];

    UI: {
        isInitializing: boolean;
    };

    onCompetitionItemClick(id: number): void;
}

export interface ICompetititonsMenuContainerState {

}

function mapStateToProps(state: IStore, ownProps: Partial<ICompetititonsMenuContainerProps>): Partial<ICompetititonsMenuContainerProps> {
    return {
        selectedCompetitionId: state.competitionStructure.selectedCompetitionId,
        categories: state.competitionStructure.categories,

        UI: {
            isInitializing: state.competitionStructure.isInitializing
        }
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetititonsMenuContainerProps> {
    return {
        onCompetitionItemClick: (id: number) => dispatch(CompetitionStructureDuck.actionCreators.selectCompetition(id))
    };
}

class CompetititonsMenuContainer extends React.Component<ICompetititonsMenuContainerProps, ICompetititonsMenuContainerState> {
    constructor(props: ICompetititonsMenuContainerProps) {
        super(props);

    }

    @autobind
    _renderAddNewListItem() {
        return <List.Item className='competition-list-item new-item' key="new-item">
            <List.Content className='competition-list-item_content'>
                <Icon name='plus' />
                {LocalizationProvider.Strings.addNewCompetitionButtonText}
            </List.Content>
        </List.Item>;
    }

    @autobind
    _renderCompetitionListItem(competition: ICompetition) {
        const className = classNames('competition-list-item', {
            'selected-list-item': this.props.selectedCompetitionId === competition.id
        });
        return <List.Item className={className} key={competition.id} onClick={() => this.props.onCompetitionItemClick(competition.id)}>
            <List.Content className='competition-list-item_content'>
                <Icon name='hashtag' />
                {competition.name}
            </List.Content>
        </List.Item>;
    }

    @autobind
    _renderCategoryListItem(category: ICategory) {
        const className = classNames('category-list-item');
        return <List.Item className={className} key={category.id} >
            <List.Content className='category-list-item_content'>
                {category.name}
                <List.List>
                    {
                        category.competitions.map(competition => {
                            return this._renderCompetitionListItem(competition);
                        })
                    }
                </List.List>
            </List.Content>
        </List.Item>;
    }

    @autobind
    _renderCompetitionList() {
        const {
            categories
        } = this.props;

        return <List className='competition-list' selection verticalAlign='middle'>
            {this._renderAddNewListItem()}
            {
                categories.map(category => {
                    return this._renderCategoryListItem(category);
                })
            }
        </List>;
    }

    // TODO
    @autobind
    _renderHeaderOptions() {
        return <Dropdown icon='angle down'>
            <Dropdown.Menu>
                <Dropdown.Item text='Edit' icon='write' />
                <Dropdown.Item text='Delete' icon='delete' />
            </Dropdown.Menu>
        </Dropdown>;
    }

    render() {
        const {
            categories
        } = this.props;

        const {
            isInitializing
        } = this.props.UI;

        return (
            <Container fluid className="app-left-subcategory-menu">
                <Header as='h2'>
                    {LocalizationProvider.Strings.Navigation.competition}
                    {this._renderHeaderOptions()}
                </Header>
                <div className='competition-list-container'>
                    {this._renderCompetitionList()}
                </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetititonsMenuContainer);
