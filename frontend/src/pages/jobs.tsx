import React, { useState, useEffect } from 'react';
import { Button, message, Space, Modal } from 'antd';
import api from '@/services/api';
import DataTable from '@/components/Table';
import EntityModal from '@/components/EntityModal';
import PreviewModal from '@/components/PreviewModal';
import { BsPencilSquare, BsEyeFill, BsTrash3Fill } from "react-icons/bs";

interface JobType {
    key: string;
    title: string;
    category: string;
    company: string;
    description: string;
    location: string;
    salary: number;
    jobType: string;
}

const JobPage: React.FC = () => {
    const [jobs, setJobs] = useState<JobType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const [editingJob, setEditingJob] = useState<JobType | null>(null);
    const [previewData, setPreviewData] = useState<JobType | null>(null);

    // Fetch dropdown data
    const fetchDropdownData = async () => {
        try {
            const [categoryRes, companyRes, jobTypeRes] = await Promise.all([
                api.get('/categories'),
                api.get('/companies'),
                api.get('/types'),
            ]);
            setCategories(categoryRes.data.results.map((item: any) => ({
                label: item.name,
                value: item._id,
            })));
            setCompanies(companyRes.data.results.map((item: any) => ({
                label: item.name,
                value: item._id,
            })));
            setJobTypes(jobTypeRes.data.results.map((item: any) => ({
                label: item.name,
                value: item._id,
            })));
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            message.error('Failed to fetch dropdown data.');
        }
    };

    // Fetch jobs from API
    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            const fetchedData = response.data.results.map((item: any) => ({
                key: item._id,
                title: item.title,
                category: item.category.name,
                company: item.company.name,
                description: item.description,
                location: item.location,
                salary: item.salary,
                jobType: item.jobType.name,
            }));
            setJobs(fetchedData);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            message.error('Failed to fetch jobs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDropdownData();
        fetchJobs();
    }, []);

    // Handle Add or Edit Job
    const handleAddOrEditJob = async (values: any) => {
        if (editingJob) {
            try {

                await api.put(`/jobs/${editingJob.key}`, values);

                setJobs((prevJobs) =>
                    prevJobs.map((item) =>
                        item.key === editingJob.key
                            ? { ...item, ...values }
                            : item
                    )
                );
                message.success('Job updated successfully.');
            } catch (error) {
                console.error('Error updating job:', error);
                message.error('Failed to update job.');
            }
        } else {
            try {
                const response = await api.post('/jobs', values);
                setJobs((prevJobs) => [
                    ...prevJobs,
                    {
                        key: response.data._id,
                        title: response.data.title,
                        category: response.data.category.name,
                        company: response.data.company.name,
                        description: response.data.description,
                        location: response.data.location,
                        salary: response.data.salary,
                        jobType: response.data.jobType.name,
                    },
                ]);
                message.success('Job added successfully.');
            } catch (error) {
                console.error('Error adding job:', error);
                message.error('Failed to add job.');
            }
        }
        setIsModalVisible(false);
        setEditingJob(null);
    };

    // Show confirmation before delete
    const showDeleteConfirm = (key: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this job?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: () => handleDeleteJob(key),
        });
    };

    // Handle delete job
    const handleDeleteJob = async (key: string) => {
        try {
            await api.delete(`/jobs/${key}`);
            setJobs((prevJobs) => prevJobs.filter((item) => item.key !== key));
            message.success('Job deleted successfully.');
        } catch (error) {
            console.error('Error deleting job:', error);
            message.error('Failed to delete job.');
        }
    };

    // Define columns for the table
    const columns = [
        {
            title: 'Job Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'Job Type',
            dataIndex: 'jobType',
            key: 'jobType',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: JobType) => (
                <Space>
                    <Button
                        type="default"
                        onClick={() => {
                            setEditingJob(record);
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
                    setEditingJob(null);
                }}
            >
                Add Job
            </Button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable<JobType> data={jobs} columns={columns} />
            )}
            <EntityModal
                title="Create or Edit Job"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleAddOrEditJob}
                categories={categories}
                companies={companies}
                jobTypes={jobTypes}
                fields={[
                    {
                        name: 'title',
                        label: 'Job Title',
                        inputType: 'text',
                        rules: [{ required: true, message: 'Please enter the job title' }],
                    },
                    {
                        name: 'category',
                        label: 'Category',
                        inputType: 'dropdown',
                        options: categories,
                        rules: [{ required: true, message: 'Please select a category' }],
                    },
                    {
                        name: 'company',
                        label: 'Company',
                        inputType: 'dropdown',
                        options: companies,
                        rules: [{ required: true, message: 'Please select a company' }],
                    },
                    {
                        name: 'jobType',
                        label: 'Job Type',
                        inputType: 'dropdown',
                        options: jobTypes,
                        rules: [{ required: true, message: 'Please select a job type' }],
                    },
                    {
                        name: 'location',
                        label: 'Location',
                        inputType: 'text',
                        rules: [{ required: true, message: 'Please enter the location' }],
                    },
                    {
                        name: 'salary',
                        label: 'Salary',
                        inputType: 'number',
                        rules: [{ required: true, message: 'Please enter the salary' }],
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        inputType: 'textarea',
                        rules: [{ message: 'Please enter the description' }],
                    },
                ]}
                initialValues={editingJob || { title: '', location: '', salary: '', description: '', category: '', company: '', jobType: '' }}
                okText="Save"
                cancelText="Cancel"
                entityType={"job"}
            />
            <PreviewModal
                title="Job Details"
                open={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                fields={[
                    { name: 'title', label: 'Title' },
                    { name: 'category', label: 'Category' },
                    { name: 'company', label: 'Company' },
                    { name: 'jobType', label: 'Job Type' },
                    { name: 'location', label: 'Location' },
                    { name: 'salary', label: 'Salary' },
                    { name: 'description', label: 'Description' },
                ]}
                data={previewData}
            />
        </div>
    );
};

export default JobPage;
