import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { apiClient } from "@/services/api-client"
import { toast } from "sonner"
import dayjs from "dayjs"

type RecordDetail = {
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

export default function VehicleRecordDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [record, setRecord] = useState<RecordDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRecord = async () => {
    try {
      setLoading(true)

      const res = await apiClient.get(
        `http://13.127.188.130:3002/user/vehicle-records/${id}`
      )

      setRecord(res.data?.data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load record details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchRecord()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!record) {
    return <p>Record not found</p>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <div className="space-y-4 bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold">
          {record.uvr_title}
        </h2>

        <div>
          <p className="text-sm text-gray-500">Description</p>
          <p>{record.uvr_description}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p>{record.uvr_category}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Base Price</p>
          <p>₹{Number(record.uvr_base_price).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Seller</p>
          <p>{record.user?.user_full_name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Created</p>
          <p>
            {dayjs(record.uvr_created_at).format(
              "DD MMM YYYY, hh:mm A"
            )}
          </p>
        </div>
      </div>
    </div>
  )
}