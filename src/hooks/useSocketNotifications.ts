import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSocket } from "../context/SocketContext";
import {
  addCourse,
  updateCourseSuccess,
  deleteCourseSuccess,
} from "../features/courses/coursesSlice";
import type { Course } from "../features/courses/coursesSlice";

export const useSocketNotifications = () => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(
      "new_course_added",
      (data: { message: string; course: Course }) => {
        console.log("NEW COURSE DATA:", data);
        dispatch(addCourse(data.course));
        toast.success(`${data.message}: ${data.course.title}`, {
          duration: 5000,
          icon: "🆕",
        });
      },
    );

    socket.on("course_updated", (data: { message: string; course: Course }) => {
      console.log("UPDATE COURSE DATA:", data);
      dispatch(updateCourseSuccess(data.course));
      toast.success(`${data.message}: ${data.course.title}`, {
        duration: 5000,
        icon: "📝",
      });
    });

    socket.on(
      "course_deleted",
      (data: { message: string; courseId: string }) => {
        console.log("DELETE COURSE DATA:", data);
        dispatch(deleteCourseSuccess(data.courseId));
        toast.error(data.message, {
          duration: 5000,
          icon: "🗑️",
        });
      },
    );

    return () => {
      socket.off("new_course_added");
      socket.off("course_updated");
      socket.off("course_deleted");
    };
  }, [socket, isConnected, dispatch]);
};
