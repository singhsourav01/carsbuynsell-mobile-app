export interface FileType {
  file_id: string;
  file_uploaded_by_id: string;
  file_upload_type: string;
  file_is_deleted: boolean;
  file_media_type: string;
  file_url: string;
  file_created_at: string;
  file_updated_at: string;
  file_thumbnail_url: string | null;
}


import { deleteApi, postApi } from "../utils/api";
import useSWRMutation from "swr/mutation";

export const useUploadFilesService = () => {
  return useSWRMutation(
    "/file/upload",
    (url: string, { arg }: { arg: { body: FormData } }) => {
      return postApi<FileType[], FormData>(url, arg.body);
    }
  );
};

export const useDeleteFileService = () => {
  return useSWRMutation(
    `/file/delete/`,
    (url: string, { arg }: { arg: string }) => {
      return deleteApi<FileType>(url + arg);
    }
  );
};
