import React, { useState, useEffect } from 'react';
import { Button, message, Space, Modal } from 'antd';
import api from '@/services/api';
import DataTable from '@/components/Table';
import EntityModal from '@/components/EntityModal';
import PreviewModal from '@/components/PreviewModal';
import { BsPencilSquare, BsEyeFill, BsTrash3Fill } from "react-icons/bs";

interface DataType {
    key: string;
    name: string;
    description: string;
    jobCount: number;
}

const TypesPage: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const [editingData, setEditingData] = useState<DataType | null>(null);
    const [previewData, setPreviewData] = useState<DataType | null>(null);

    // Fetch job types from API
    const fetchJobTypes = async () => {
        try {
            const response = await api.get('/types');
            const fetchedData = response.data.results.map((item: any) => ({
                key: item._id,
                name: item.name,
                description: item.description,
                jobCount: item.jobCount,
            }));
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching job types:', error);
            message.error('Failed to fetch job types.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobTypes();
    }, []);

    // Handle Add or Edit Job Type
    const handleAddOrEditJobType = async (values: any) => {
        if (editingData) {
            try {
                await api.put(`/types/${editingData.key}`, values);
                setData((prevData) =>
                    prevData.map((item) =>
                        item.key === editingData.key
                            ? { ...item, ...values }
                            : item
                    )
                );
                message.success('Job type updated successfully.');
            } catch (error) {
                console.error('Error updating job type:', error);
                message.error('Failed to update job type.');
            }
        } else {
            try {
                const response = await api.post('/types', values);
                setData((prevData) => [
                    ...prevData,
                    {
                        key: response.data._id,
                        name: response.data.name,
                        description: response.data.description,
                        jobCount: response.data.jobCount,
                    },
                ]);
                message.success('Job type added successfully.');
            } catch (error) {
                console.error('Error adding job type:', error);
                message.error('Failed to add job type.');
            }
        }
        setIsModalVisible(false);
        setEditingData(null);
    };

    // Show confirmation before delete
    const showDeleteConfirm = (key: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this job type?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: () => handleDeleteJobType(key),
        });
    };

    // Handle delete job type
    const handleDeleteJobType = async (key: string) => {
        try {
            await api.delete(`/types/${key}`);
            setData((prevData) => prevData.filter((item) => item.key !== key));
            message.success('Job type deleted successfully.');
        } catch (error) {
            console.error('Error deleting job type:', error);
            message.error('Failed to delete job type.');
        }
    };

    // Define columns for the table
    const columns = [
        {
            title: 'Job Type Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '35%',
        },
        {
            title: 'Jobs',
            dataIndex: 'jobCount',
            key: 'jobCount',
            width: '10%',
            sorter: (a: any, b: any) => a.jobCount - b.jobCount,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: DataType) => (
                <Space>
                    <Button
                        type="default"
                        className='bg-green-600 text-white hover:!bg-green-500 hover:!text-white !border-none'
                        onClick={() => {
                            setEditingData(record);
                            setIsModalVisible(true);
                        }}
                    >
                        <BsPencilSquare />
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setPreviewData(record);
                            setIsPreviewVisible(true);
                        }}
                    >
                        <BsEyeFill />
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => showDeleteConfirm(record.key)}
                    >
                        <BsTrash3Fill />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setIsModalVisible(true);
                    setEditingData(null);
                }}
            >
                Add Job Type
            </Button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable<DataType> data={data} columns={columns} />
            )}
            <EntityModal
                title="Create or Edit Job Type"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleAddOrEditJobType}
                fields={[
                    {
                        name: 'name',
                        label: 'Job Type Name',
                        inputType: 'text',
                        rules: [{ required: true, message: 'Please enter the job type name' }],
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        inputType: 'textarea',
                        rules: [{ message: 'Please enter a description', }],
                    },
                ]}
                initialValues={editingData || { name: '', description: '' }}
                okText="Save"
                cancelText="Cancel"
                entityType={"job type"}
            />
            <PreviewModal
                title="Job Type Details"
                open={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                fields={[
                    {
                        name: 'name',
                        label: 'Name'
                    },
                    {
                        name: 'description',
                        label: 'Description'
                    },
                    {
                        name: 'jobCount',
                        label: 'Total Jobs'
                    },
                ]}
                data={previewData || {}}
            />
        </div>
    );
};

export default TypesPage;
