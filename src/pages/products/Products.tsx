import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductState,
  deleteProduct,
  getProducts,
} from "../../store/slice/productSlice";
import Table from "../../components/Container/Table/Table";
import type { Column } from "../../components/Container/Table/Table";
import { ProductGrid } from "./ProductGrid";
import CreateProduct from "./CreateProduct";
import ConfirmDeleteModal from "../../components/Container/CommonDeleteModel/CommonDeleteModel";
import { usePopup } from "../../components/Container/Popup/PopupProvider";
import Image from "../../components/Container/Image/Image";
import { getVariantData } from "../../utils/getVariantData";

const Products = () => {
  const dispatch = useDispatch();
  const { showPopup } = usePopup();
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { deleteSuccess, deleteError } = useSelector(
    (state: any) => state.product,
  );

  const { products, loading } = useSelector(
    (state: any) => state.product || {},
  );
  const productData = products?.products;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    dispatch(getProducts() as any);
  }, []);

  const handleAdd = () => {
    setOpenCreate(true);
  };

  const handleEdit = (item: any) => {
    setSelectedProduct(item?.productData);
    setOpenCreate(true);
  };

  const handleDelete = (item: any) => {
    setSelectedProduct(item?.productData);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;
    dispatch(deleteProduct(selectedProduct._id) as any);
    setDeleteOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (deleteSuccess) {
      showPopup("success", deleteSuccess);
      dispatch(getProducts() as any);
      dispatch(clearProductState());
    }
    if (deleteError) {
      showPopup("error", deleteError);
      dispatch(clearProductState());
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const columns: Column<any>[] = [
    {
      key: "image",
      header: "Image",
      width: "100px",
      align: "center",
      accessor: (row: any) => (
        <Image src={row.image} className="w-12 h-12 object-cover rounded-md" />
      ),
    },
    {
      key: "name",
      header: "PRODUCT NAME",
      width: "200px",
      sortable: true,
    },
    {
      key: "category",
      header: "CATEGORY",
      width: "150px",
    },
    {
      key: "price",
      header: "PRICE",
      width: "120px",
      accessor: (row: any) => `₹ ${row.price}`,
    },
    {
      key: "stock",
      header: "STOCK",
      width: "100px",
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
        onEdit: (row: any) => handleEdit(row),
        onDelete: (row: any) => handleDelete(row),
      },
    },
  ];

  const formattedProducts =
    productData?.map((item: any) => {
      const { price, stock, image } = getVariantData(item);
      return {
        _id: item._id,
        name: item.name,
        category: item?.category?.name,
        price,
        stock,
        image: image || "/fallback.png",
        productData: item,
      };
    }) || [];

  return (
    <>
      {openCreate ? (
        <CreateProduct
          onclose={() => {
            setOpenCreate(false);
            setSelectedProduct(null);
          }}
          data={selectedProduct}
        />
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Products ({formattedProducts?.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 border rounded cursor-pointer ${
                  viewMode === "grid" ? "bg-orange-600 text-white" : "bg-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 border rounded  cursor-pointer ${
                  viewMode === "list" ? "bg-orange-600 text-white" : "bg-white"
                }`}
              >
                List
              </button>
            </div>
          </div>
          {viewMode === "grid" ? (
            <ProductGrid
              products={formattedProducts}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <Table
              columns={columns}
              data={formattedProducts}
              isLoading={loading}
              showSearch={true}
              showPagination={true}
              showAddButton={true}
              onAddClick={handleAdd}
              tableHeight="600px"
            />
          )}
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={deleteOpen}
        title="Delete this product?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
};

export default Products;
