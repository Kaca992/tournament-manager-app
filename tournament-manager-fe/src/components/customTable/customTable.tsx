import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './customTable.scss';
import { Table } from 'semantic-ui-react';
import { ICustomTableHeader } from './customTable.utils';
import { getObjectValue } from '../../utils/common';
import * as _ from 'lodash';

type SortDirectionType = 'ascending' | 'descending';

export interface ICustomTableProps {
    data: any[];
    headers: ICustomTableHeader[];
    isTableSortable?: boolean;
}

export interface ICustomTableState {
    initData: any[];
    sortedData: any[];
    sortedColumnKey?: string;
    sortDirection?: SortDirectionType;
}

export default class CustomTable extends React.Component<ICustomTableProps, ICustomTableState> {
    constructor(props: ICustomTableProps) {
        super(props);
        this.state = {
            initData: props.data,
            sortedData: props.data
        };
    }

    private _renderHeaderRow = () => {
        const { headers } = this.props;
        const { sortedColumnKey, sortDirection } = this.state;

        return <Table.Header>
            <Table.Row>
                {
                    headers.map(header => {
                        return <Table.HeaderCell
                            width={header.columns}
                            key={header.headerKey}
                            textAlign={header.textAlign}
                            sorted={header.headerKey === sortedColumnKey ? sortDirection : undefined}
                            onClick={() => this._onHandleSort(header.headerKey)}
                        >
                            {header.displayText}
                        </Table.HeaderCell>;
                    })
                }
            </Table.Row>
        </Table.Header>;
    }

    private _onHandleSort = (clickedHeaderKey: string) => {
        const { initData, sortDirection, sortedColumnKey, sortedData } = this.state

        if (sortedColumnKey !== clickedHeaderKey) {
            this.setState({
                sortedData: _.sortBy(initData, [sortedColumnKey]),
                sortDirection: "ascending",
                sortedColumnKey
            });

            return
        }

        this.setState({
            sortedData: sortedData.reverse(),
            sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
        });
    }

    private _renderBodyRow = (data: any, index: number) => {
        const { headers } = this.props;
        return <Table.Row key={index}>
            {
                headers.map(header => {
                    return <Table.Cell width={header.columns}
                        key={header.headerKey}
                        textAlign={header.textAlign}>
                        {getObjectValue(data, header.headerKey)}
                    </Table.Cell>;
                })
            }
        </Table.Row>;
    }

    public render() {
        return (
            <div className='custom-table_container'>
                <Table
                    celled
                    color='blue'
                    inverted
                    compact
                >
                    {this._renderHeaderRow()}
                    <Table.Body>
                        {
                            this.state.sortedData.map((rowData, index) => {
                                return this._renderBodyRow(rowData, index);
                            })
                        }
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
