import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"
import { apiClient } from "@/services/api-client"
import { toast } from "sonner"
import dayjs from "dayjs"

type VehicleRecord = {
  uvr_id: string
  uvr_title: string
  uvr_description: string
  uvr_category: string
  uvr_base_price: string
  uvr_created_at: string
  user?: {
    user_full_name?: string
  }
}

export default function VehicleRecords() {
  const navigate = useNavigate()

  const [records, setRecords] = useState<VehicleRecord[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecords = async () => {
    try {
      setLoading(true)

      const res = await apiClient.get(
        "http://13.127.188.130:3002/user/vehicle-records"
      )

      setRecords(res.data?.data?.records || [])
    } catch (err) {
      console.error(err)
      toast.error("Failed to load vehicle records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const columns: ColumnDef<VehicleRecord>[] = [
    {
      accessorKey: "uvr_title",
      header: "Title",
    },
    {
      accessorKey: "uvr_category",
      header: "Category",
    },
    {
      accessorKey: "uvr_base_price",
      header: "Base Price",
      cell: ({ row }) => (
        <span>₹{Number(row.original.uvr_base_price).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "user",
      header: "Seller",
      cell: ({ row }) =>
        row.original.user?.user_full_name || "Unknown",
    },
    {
      accessorKey: "uvr_created_at",
      header: "Created",
      cell: ({ row }) =>
        dayjs(row.original.uvr_created_at).format("DD MMM YYYY"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate(`/vehicle-records/${row.original.uvr_id}`)
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">
          Vehicle Records
        </h1>
        <p className="text-gray-500">
          View seller-submitted vehicle records
        </p>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={records}
          searchKey="uvr_title"
          searchPlaceholder="Search vehicle records..."
        />
      )}
    </div>
  )
}