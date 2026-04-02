import { useState } from "react";
import Table from "../../components/Container/Table/Table";
import type { Column } from "../../components/Container/Table/Table";
import CreateCouponModal from "./CreateCouponModal";
import ConfirmDeleteModal from "../../components/Container/CommonDeleteModel/CommonDeleteModel";
import { useDispatch } from "react-redux";
import { deleteCoupon } from "../../store/slice/couponSlice";

interface CouponData {
  id: string;
  code: string;
  type: string;
  value: number;
  minPurchaseAmount: number;
  startDate: string;
  endDate: string;
}

const Coupon = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);

  const columns: Column<CouponData>[] = [
    {
      key: "code",
      header: "CODE",
      width: "140px",
      type: "text",
    },
    {
      key: "type",
      header: "TYPE",
      width: "120px",
      type: "text",
    },
    {
      key: "value",
      header: "VALUE",
      width: "100px",
      type: "text",
    },
    {
      key: "minPurchaseAmount",
      header: "MIN PURCHASE",
      width: "150px",
      type: "text",
    },
    {
      key: "startDate",
      header: "START DATE",
      width: "150px",
      type: "text",
    },
    {
      key: "endDate",
      header: "END DATE",
      width: "150px",
      type: "text",
    },
    {
      key: "actions",
      header: "ACTIONS",
      width: "120px",
      align: "center",
      type: "action",
      actionConfig: {
        showEdit: true,
        showDelete: true,
        onEdit: (row: any) => {
          setEditData(row);
          setOpenModal(true);
        },
        onDelete: (row: any) => {
          setSelectedRow(row);
          setDeleteModal(true);
        },
      },
    },
  ];

  const handleDelete = async () => {
    if (selectedRow?.id) {
      await dispatch(deleteCoupon(selectedRow.id) as any);
      setCoupons((prev) => prev.filter((item) => item.id !== selectedRow.id));
    }
    setDeleteModal(false);
  };

  return (
    <div className="p-6">
      <Table
        columns={columns}
        data={coupons}
        showAddButton={true}
        onAddClick={() => {
          setEditData(null);
          setOpenModal(true);
        }}
        showPagination={true}
        showSearch={true}
        emptyMessage="No coupons found"
        loadingMessage="Loading coupons..."
        tableHeight="600px"
      />

      {openModal && (
        <CreateCouponModal
          onClose={() => setOpenModal(false)}
          data={editData}
        />
      )}
      <ConfirmDeleteModal
        isOpen={deleteModal}
        title="Are you sure you want to delete this coupon?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default Coupon;
