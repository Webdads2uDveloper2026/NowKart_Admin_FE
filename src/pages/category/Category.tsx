import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Table/Table";
import CreateCategoryModal from "./CreateCategoryModal";
import { getCategories, deleteCategory, clearCategoryState } from "../../store/slice/categorySlice";
import Image from "../../components/Image/Image";

interface CategoryData {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
}

const Category = () => {
  const dispatch = useDispatch();
  const { categories, loading, success } = useSelector(
    (state: any) => state.category || {}
  );

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    dispatch(getCategories() as any);
  }, []);

  useEffect(() => {
    if (success && openModal) {
      setOpenModal(false);
      setEditData(null);
      dispatch(getCategories() as any);
      dispatch(clearCategoryState());
    }
  }, [success, openModal]);

  const columns = [
    {
      key: "image",
      header: "Image",
      width: "100px",
      align: "center" as const,
      type: "custom" as const,
      render: (row: any) => (
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
      align: "left" as const,
      type: "text" as const,
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
          if (window.confirm("Are you sure you want to delete?")) {
            dispatch(deleteCategory(row.slug) as any).then(() => {
              dispatch(getCategories() as any);
            });
          }
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
              id: item.categoryName._id,
              name: item.categoryName.name,
              description: item.categoryName.description,
              createdAt: new Date(
                item.categoryName.createdAt
              ).toLocaleDateString(),
              isActive: item.categoryName.status === 1,
              slug: item.categoryName.slug,
              image: item.categoryName.categoryImage,
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
    </div>
  );
};

export default Category;