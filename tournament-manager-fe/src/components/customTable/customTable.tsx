import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './customTable.scss';
import { Table } from 'semantic-ui-react';
import { ICustomTableHeader } from './customTable.utils';

export interface ICustomTableProps {
    data: any[];
    headers: ICustomTableHeader[];
}

export interface ICustomTableState {

}

export default class CustomTable extends React.Component<ICustomTableProps, ICustomTableState> {
    constructor(props: ICustomTableProps) {
        super(props);

    }

    @autobind
    private _renderHeaderRow() {
        const { headers } = this.props;

        return <Table.Header>
            <Table.Row>
                {
                    headers.map(header => {
                        return <Table.HeaderCell
                            width={header.columns}
                            key={header.headerKey}
                            textAlign={header.textAlign}>
                            {header.displayText}
                        </Table.HeaderCell>;
                    })
                }
            </Table.Row>
        </Table.Header>;
    }

    @autobind
    private _renderBodyRow(data: any, index: number) {
        const { headers } = this.props;
        return <Table.Row key={index}>
            {
                headers.map(header => {
                    return <Table.Cell width={header.columns}
                        key={header.headerKey}
                        textAlign={header.textAlign}>
                        {data[header.headerKey]}
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
                            this.props.data.map((rowData, index) => {
                                return this._renderBodyRow(rowData, index);
                            })
                        }
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
