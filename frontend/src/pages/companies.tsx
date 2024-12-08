import React, { useState, useEffect } from 'react';
import { Button, message, Space, Modal } from 'antd';
import api from '@/services/api';
import DataTable from '@/components/Table';
import EntityModal from '@/components/EntityModal';
import PreviewModal from '@/components/PreviewModal';
import { BsPencilSquare, BsEyeFill, BsTrash3Fill } from "react-icons/bs"

interface DataType {
    key: string;
    name: string;
    description: string;
    website: string;
    jobCount: number;
}

const CompaniesPage: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const [editingData, setEditingData] = useState<DataType | null>(null);
    const [previewData, setPreviewData] = useState<DataType | null>(null);

    // Fetch companies from API
    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies');
            const fetchedData = response.data.results.map((item: any) => ({
                key: item._id,
                name: item.name,
                description: item.description,
                website: item.website,
                jobCount: item.jobCount,
            }));
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching companies:', error);
            message.error('Failed to fetch companies.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Handle Add or Edit Company
    const handleAddOrEditCompany = async (values: any) => {
        if (editingData) {
            try {
                await api.put(`/companies/${editingData.key}`, values);
                setData((prevData) =>
                    prevData.map((item) =>
                        item.key === editingData.key
                            ? { ...item, ...values }
                            : item
                    )
                );
                message.success('Company updated successfully.');
            } catch (error) {
                console.error('Error updating company:', error);
                message.error('Failed to update company.');
            }
        } else {
            try {
                const response = await api.post('/companies', values);
                setData((prevData) => [
                    ...prevData,
                    {
                        key: response.data._id,
                        name: response.data.name,
                        description: response.data.description,
                        website: response.data.website,
                        jobCount: response.data.jobCount,
                    },
                ]);
                message.success('Company added successfully.');
            } catch (error) {
                console.error('Error adding company:', error);
                message.error('Failed to add company.');
            }
        }
        setIsModalVisible(false);
        setEditingData(null);
    };

    // Show confirmation before delete
    const showDeleteConfirm = (key: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this company?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: () => handleDeleteCompany(key),
        });
    };

    // Handle delete company
    const handleDeleteCompany = async (key: string) => {
        try {
            await api.delete(`/companies/${key}`);
            setData((prevData) => prevData.filter((item) => item.key !== key));
            message.success('Company deleted successfully.');
        } catch (error) {
            console.error('Error deleting company:', error);
            message.error('Failed to delete company.');
        }
    };

    // Define columns for the table
    const columns = [
        {
            title: 'Company Name',
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
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            width: '20%',
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
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
                Add Company
            </Button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable<DataType> data={data} columns={columns} />
            )}
            <EntityModal
                title="Create or Edit Company"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleAddOrEditCompany}
                fields={[
                    {
                        name: 'profilePicture',
                        label: 'Profile Picture',
                        inputType: 'fileupload',
                        uploadAction: '/upload',
                        accept: '.png,.jpg,.jpeg',
                        listType: 'picture',
                        uploadButtonText: 'Upload Avatar',
                    },
                    {
                        name: 'name',
                        label: 'Company Name',
                        inputType: 'text',
                        rules: [{ required: true, message: 'Please enter the company name' }],
                    },
                    {
                        name: 'website',
                        label: 'Website',
                        rules: [{ type: 'url' }],
                        inputType: 'text'
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
                entityType={"company"}
            />
            <PreviewModal
                title="Company Details"
                open={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                fields={[
                    {
                        name: 'name',
                        label: 'Company Name'
                    },
                    {
                        name: 'description',
                        label: 'Description'
                    },
                    {
                        name: 'website',
                        label: 'Website'
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

export default CompaniesPage;
