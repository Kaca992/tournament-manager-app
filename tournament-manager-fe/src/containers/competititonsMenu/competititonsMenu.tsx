import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './competititonsMenu.scss';
import { ICompetition, ICategory } from '../../common/dataStructures';
import { CategoryDuck } from '../../ducks/categories.duck';
import { Container, Header, Loader, List, Icon, Segment, Menu, Dropdown, Popup, Button } from 'semantic-ui-react';

export interface ICompetititonsMenuContainerProps {
    selectedCompetitionId: number;
    selectedCategory: ICategory;
    competitions: ICompetition[];

    UI: {
        isInitializing: boolean;
    };

    onCompetitionItemClick?(id: number): void;
}

export interface ICompetititonsMenuContainerState {

}

function mapStateToProps(state: IStore, ownProps: Partial<ICompetititonsMenuContainerProps>): Partial<ICompetititonsMenuContainerProps> {
    return {
        selectedCompetitionId: state.competitions.selectedCompetitionId,
        competitions: state.competitions.competitions,
        selectedCategory: CategoryDuck.selectors.getCategory(state),

        UI: {
            isInitializing: state.competitions.isInitializing
        }
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetititonsMenuContainerProps> {
    return {

    };
}

class CompetititonsMenuContainer extends React.Component<ICompetititonsMenuContainerProps, ICompetititonsMenuContainerState> {
    constructor(props: ICompetititonsMenuContainerProps) {
        super(props);

    }

    @autobind
    _renderAddNewListItem() {
        return <List.Item key="new-item">
            <List.Content>
                <Icon name='plus' />
                Dodaj Novo
            </List.Content>
        </List.Item>;
    }

    @autobind
    _renderCompetitionListItem(competition: ICompetition) {
        return <List.Item key={competition.id}>
            <List.Content>
                <Icon name='hashtag' />
                {competition.name}
            </List.Content>
        </List.Item>;
    }

    @autobind
    _renderCompetitionList() {
        const {
            competitions
        } = this.props;

        return <List selection verticalAlign='middle'>
            {this._renderAddNewListItem()}
            {
                competitions.map(competition => {
                    return this._renderCompetitionListItem(competition);
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
            selectedCategory
        } = this.props;

        const {
            isInitializing
        } = this.props.UI;

        return (
            <Container fluid className="app-left-subcategory-menu">
                <Header as='h2'>
                    {selectedCategory.name}
                    {this._renderHeaderOptions()}
                </Header>
                <div className='categories-list-container'>
                    <Header as='h3'>
                        Competitions
                    </Header>
                    {this._renderCompetitionList()}
                </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetititonsMenuContainer);
