import React from 'react';
import { Modal, Descriptions } from 'antd';

interface FieldType {
    name: string;
    label: string;
}

interface PreviewModalProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    fields: FieldType[];
    data?: object; // Data to be previewed
}

const PreviewModal: React.FC<PreviewModalProps> = ({
    title,
    open,
    onCancel,
    fields,
    data,
}) => {
    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={null} // No footer for preview-only modal
        >
            <Descriptions column={1} bordered>
                {fields.map((field) => (
                    <Descriptions.Item key={field.name} label={field.label}>
                        {data?.[field.name] || 'N/A'}
                    </Descriptions.Item>
                ))}
            </Descriptions>
        </Modal>
    );
};

export default PreviewModal;
