import { Button, Label, Modal, TextInput } from 'flowbite-react'
import React, { FC, useState } from 'react'
import { Icons } from './Icons';
import axios from 'axios';

interface EditDetailsAssetModalProps {
    categories: string[];
    details: string;
    brand: string;
    model: string;
    quantity: number;
    created_user: string;
    id: number;
    sharedState: boolean;
    updateSharedState: (value: boolean) => void;
}

export const EditDetailsAssetModal: FC<EditDetailsAssetModalProps> = ({ details, brand, model, quantity, created_user, id, sharedState, updateSharedState }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newDetails, setNewDetails] = useState(details);
    const [newBrand, setNewBrand] = useState(brand);
    const [newModel, setNewModel] = useState(model);

    const url = 'https://bn.glassmountainbpo.com:8080/inventory/editDetails';

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const body = {
            id: id,
            details: newDetails,
            created_user: created_user
        }

        try {
            const response = await axios.post(url, body);
            console.log(response.data);

            if (response.data.status === 'Success') {
                alert('Details updated successfully');
            }
        } catch (error) {
            console.log(error);
            setIsOpen(false);
        }
        updateSharedState(!sharedState);
        setIsOpen(false);
    }
    return (
        <div>
            <Button className="text-white bg-yellow-400 dark:bg-yellow-400 dark:enabled:hover:bg-yellow-500 dark:focus:ring-yellow-800" onClick={() => setIsOpen(true)}>
                <div className="flex items-center gap-x-2">
                    <Icons.editAsset height={14} width={14} />
                </div>
            </Button>
            <Modal onClose={() => setIsOpen(false)} show={isOpen}>
                <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
                    <strong>Edit Asset: </strong><p> {brand} {model} ({quantity})</p>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="id">Details</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="changeDetails"
                                    name="ChangeDetails"
                                    value={newDetails}
                                    onChange={(e) => setNewDetails(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="id">Model</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="changeModel"
                                    name="ChangeModel"
                                    value={newModel}
                                    onChange={(e) => setNewModel(e.target.value)}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="id">Brand</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="changeBrand"
                                    name="changeBrand"
                                    value={newBrand}
                                    onChange={(e) => setNewBrand(e.target.value)}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={(e) => { handleSubmit(e) }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
