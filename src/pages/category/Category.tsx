import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Container/Table/Table";
import type { Column } from "../../components/Container/Table/Table";
import CreateCategoryModal from "./CreateCategoryModal";
import {
  getCategories,
  deleteCategory,
  clearCategoryState,
  updateCategory,
} from "../../store/slice/categorySlice";
import Image from "../../components/Container/Image/Image";
import ConfirmDeleteModal from "../../components/Container/CommonDeleteModel/CommonDeleteModel";

interface CategoryData {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  image?: string;
  slug?: any;
}

const Category = () => {
  const dispatch = useDispatch();
  const { categories, loading, success } = useSelector(
    (state: any) => state.category || {},
  );

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  useEffect(() => {
    dispatch(getCategories() as any);
  }, []);

  useEffect(() => {
    if (success) {
      setOpenModal(false);
      setEditData(null);
      dispatch(getCategories() as any);
      dispatch(clearCategoryState());
    }
  }, [success]);

  const handleConfirmDelete = () => {
    if (selectedRow?.slug) {
      dispatch(deleteCategory(selectedRow.slug) as any);
    }
  };

  useEffect(() => {
    if (success) {
      setDeleteModalOpen(false);
      setSelectedRow(null);
      dispatch(getCategories() as any);
      dispatch(clearCategoryState());
    }
  }, [success]);

  const columns: Column<CategoryData>[] = [
    {
      key: "image",
      header: "Image",
      width: "100px",
      align: "center",
      accessor: (row: any) => (
        <Image
          src={row.image}
          alt="category"
          className="w-12 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      key: "name",
      header: "CATEGORY NAME",
      width: "180px",
      sortable: true,
      align: "left",
      type: "text",
    },
    {
      key: "description",
      header: "DESCRIPTION",
      width: "250px",
      sortable: false,
      align: "left" as const,
      type: "text" as const,
    },
    {
      key: "createdAt",
      header: "CREATED DATE",
      width: "150px",
      sortable: true,
      align: "left" as const,
      type: "text" as const,
    },
    {
      key: "isActive",
      header: "STATUS",
      width: "100px",
      align: "center" as const,
      type: "toggle" as const,
      toggleConfig: {
        activeValue: true,
        inactiveValue: false,
        activeLabel: "Active",
        inactiveLabel: "Inactive",
        onToggle: (row: CategoryData, newValue: boolean) => {
          const formData = new FormData();
          formData.append("name", row.name);
          formData.append("description", row.description);
          formData.append("status", newValue ? "1" : "0");
          dispatch(
            updateCategory({
              slug: row.slug,
              formData,
            }) as any,
          );
        },
      },
    },
    {
      key: "actions",
      header: "ACTIONS",
      width: "120px",
      align: "center" as const,
      type: "action" as const,
      actionConfig: {
        showEdit: true,
        showDelete: true,
        onEdit: (row: any) => {
          setEditData(row);
          setOpenModal(true);
        },
        onDelete: (row: any) => {
          setSelectedRow(row);
          setDeleteModalOpen(true);
        },
      },
    },
  ];

  return (
    <div className="p-6">
      <Table
        columns={columns}
        data={
          categories?.length
            ? categories.map((item: any) => ({
                id: item?._id,
                name: item?.name,
                description: item?.description,
                createdAt: new Date(item?.createdAt).toLocaleDateString(),
                isActive: item?.status === 1,
                slug: item?.slug,
                image: item?.categoryImage,
                video: item?.categoryVideo,
                isTopCategory: item?.isTopCategory,
              }))
            : []
        }
        showAddButton={true}
        onAddClick={() => {
          setEditData(null);
          setOpenModal(true);
        }}
        isLoading={loading}
        defaultRowsPerPage={10}
        rowsPerPageOptions={[10, 20, 50]}
        showPagination={true}
        showSearch={true}
        emptyMessage="No categories found"
        loadingMessage="Loading categories..."
        tableHeight="600px"
        initialSortColumn="createdAt"
        initialSortDirection="desc"
        enableDragScroll={true}
      />

      {openModal && (
        <CreateCategoryModal
          onClose={() => setOpenModal(false)}
          data={editData}
        />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        title="Are you sure you want to delete this category?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={loading}
      />
    </div>
  );
};

export default Category;
