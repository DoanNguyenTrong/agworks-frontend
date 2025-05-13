import { BASE_URL } from "@/api/config";
import { apiGetAllImage } from "@/api/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import { get } from "lodash";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

interface PreviewImageDialogProps {
  id: string;
  _onclose: () => void;
}

export default function PreviewImageDialog({
  id,
  _onclose,
}: PreviewImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<any[]>([]);

  const getImage = async (id: string) => {
    try {
      const { data } = await apiGetAllImage({ filter: { taskId: [id] } });
      setImage(get(data, "metaData", []));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  console.log("image", image);

  useEffect(() => {
    if (id) {
      setOpen(true);
      getImage(id);
    }
  }, [id]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        _onclose();
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Image</DialogTitle>
          {/* <DialogDescription>
            Reset password or update email address for this user.
          </DialogDescription> */}
        </DialogHeader>
        <div className="overflow-y-auto h-[400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {image.length > 0 ? (
              image.map((i) => {
                return (
                  <div
                    key={get(i, "_id")}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square relative bg-muted">
                      {get(i, "imageData") ? (
                        <img
                          src={`${BASE_URL}${get(i, "imageData")}`}
                          alt="Task completion"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Camera className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">
                        {get(i, "fileName")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dayjs(get(i, "createdAt")).format("YYYY/MM/DD HH:mm")}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                  <h3 className="text-lg font-medium mb-2">
                    No Recent Task Photos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You have not uploaded any photos yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
