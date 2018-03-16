import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

// import './competititonsMenuContainer.scss';
import { ICompetition, ICategory } from '../../common/dataStructures';
import { CategoryDuck } from '../../ducks/categories.duck';
import { Container, Header, Loader } from 'semantic-ui-react';

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

    render() {
        const {
            selectedCategory
        } = this.props;

        const {
            isInitializing
        } = this.props.UI;

        if (!selectedCategory) {
            return null;
        }

        return (
            <Container fluid className="app-left-subcategory-menu">
                <Header as='h3'>{selectedCategory.name}</Header>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetititonsMenuContainer);
