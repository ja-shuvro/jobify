import React, { useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tooltip } from 'antd';
import type { TableColumnsType, ColumnType } from 'antd';
import type { InputRef } from 'antd';
import Highlighter from 'react-highlight-words';

// Reusable Table Props
interface DataTableProps<T> {
    data: T[];
    columns: TableColumnsType<T>;
}

// Reusable Table Component
const DataTable = <T extends Record<string, any>>({
    data,
    columns,
}: DataTableProps<T>) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState<string>('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: () => void,
        dataIndex: string
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string, isNumeric: boolean = false): ColumnType<T> => {
        if (isNumeric) {
            return {
                sorter: (a: any, b: any) => a[dataIndex] - b[dataIndex], // Numeric sorting
                render: (text: any) => text, // Render as is
            };
        }

        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => clearFilters && handleReset(clearFilters)}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                setSearchText((selectedKeys as string[])[0]);
                                setSearchedColumn(dataIndex);
                            }}
                        >
                            Filter
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            Close
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
            ),
            onFilter: (value: any, record: any) =>
                record[dataIndex]
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes((value as string).toLowerCase()),
            filterDropdownProps: {
                onOpenChange(open: any) {
                    if (open) {
                        setTimeout(() => searchInput.current?.select(), 100);
                    }
                },
            },
            render: (text: any) => {
                const truncatedText = text && text.length > 200 ? `${text.substring(0, 200)}...` : text;
                return searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={truncatedText ? truncatedText.toString() : ''}
                    />
                ) : (
                    truncatedText
                );
            },
        };
    };



    // Add search props to columns
    const enhancedColumns = [
        ...columns.map((col) => ({
            ...col,
            ...(col.dataIndex && typeof col.dataIndex === 'string'
                ? getColumnSearchProps(col.dataIndex)
                : {}),
        })),
    ];

    return <Table<T> columns={enhancedColumns} dataSource={data} rowKey={(record) => record.key || record.id} />;
};

export default DataTable;
