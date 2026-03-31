import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import CreateCategoryModal from "./CreateSubCategoryModal";
import {
  clearSubcategoryState,
  deleteSubcategory,
  getSubcategories,
} from "../../store/slice/subcategorySlice";
import ConfirmDeleteModal from "../../components/CommonDeleteModel/CommonDeleteModel";

interface CategoryData {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  image?: string;
  slug?: string;
}

const SubCategory = () => {
  const dispatch = useDispatch();
  const { subcategories, loading, success, deleteMessage, deleteError } =
    useSelector((state: any) => state.subcategory || {});
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  useEffect(() => {
    dispatch(getSubcategories() as any);
  }, []);

  useEffect(() => {
    if (deleteMessage) {
      setDeleteModalOpen(false);
      setSelectedRow(null);

      dispatch(getSubcategories() as any);
      dispatch(clearSubcategoryState());
    }

    if (deleteError) {
      setDeleteModalOpen(false);
      dispatch(clearSubcategoryState());
    }
  }, [deleteError, deleteMessage]);

  useEffect(() => {
    if (success && openModal) {
      setOpenModal(false);
      setEditData(null);
      dispatch(getSubcategories() as any);
      dispatch(clearSubcategoryState());
    }
  }, [success, openModal]);

  const columns: Column<CategoryData>[] = [
    {
      key: "name",
      header: "SubCATEGORY NAME",
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
          console.log(`Category ${row.id} status changed:`, newValue);
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

  const handleConfirmDelete = () => {
    if (selectedRow?.slug) {
      dispatch(deleteSubcategory(selectedRow.slug) as any);
    }
  };

  return (
    <div className="p-6">
      <Table
        columns={columns}
        data={
          subcategories?.length
            ? subcategories?.map((item: any) => ({
                id: item?._id,
                name: item?.subCategory,
                description: item?.description,
                createdAt: new Date(item?.createdAt).toLocaleDateString(),
                isActive: item?.status === 1,
                slug: item?.slug,
                image: item?.categoryImage,
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
        title="Are you sure you want to delete this subcategory?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={loading}
      />
    </div>
  );
};

export default SubCategory;
