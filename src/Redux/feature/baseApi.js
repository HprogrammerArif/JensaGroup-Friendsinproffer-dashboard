import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      // ngrok support
      headers.set("ngrok-skip-browser-warning", "true");

      // Access Token
      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: [
    "profileInfo",
    "register",
    "simulation",
    "updateData",
    "showAllBuildingData",
    "showAllApartmentData",
    "dashboardData",
    "reportIssueList",
    "showMaintenanceData",
    "showMaintenanceDetails",
    "showMaintenanceFilterData",
    "showScheduleData",
    "filterScheduleData",
    "showScheduleAllData",
    "userCleanerFilter",
    "userMaintainerFilter",
    "userMiniAdminFilter",
    "showAreaList",
    "showTeamMessage",
    "showMessageHistory",
    "completionReportList",
    "weeklyWagesConfig",
    "weeklyWagesList",
  ],
  endpoints: (builder) => ({
    // ─── Auth / Profile ──────────────────────────────────────────────────
    showProfileInformation: builder.query({
      query: () => "accounts/profile/",
      providesTags: ["updateData"],
    }),

    updateProfileInformation: builder.mutation({
      query: ({ id, data }) => ({
        url: `accounts/profile/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["updateData"],
    }),

    // Change Password — POST accounts/password/change/
    changePassword: builder.mutation({
      query: (data) => ({
        url: "accounts/password/change/",
        method: "POST",
        body: data,
      }),
    }),

    // ─── Dashboard ───────────────────────────────────────────────────────
    showDashboardData: builder.query({
      query: () => "dashboard/admin/",
      providesTags: ["dashboardData"],
    }),

    showMiniAdminDashboardData: builder.query({
      query: () => "dashboard/mini-admin/",
      providesTags: ["dashboardData"],
    }),

    showCleanerDashboardData: builder.query({
      query: (filter_by = "this_week") => `dashboard/cleaner/?filter_by=${filter_by}`,
      providesTags: ["dashboardData"],
    }),

    showMaintainerDashboardData: builder.query({
      query: () => "dashboard/maintainer/",
      providesTags: ["dashboardData"],
    }),

    // ─── Buildings Management ─────────────────────────────────────────────
    showAllBuildingData: builder.query({
      query: () => "building/list/",
      providesTags: ["showAllBuildingData"],
    }),

    createBuildingData: builder.mutation({
      query: (data) => ({
        url: "building/list/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["showAllBuildingData"],
    }),

    updateBuildingData: builder.mutation({
      query: ({ id, data }) => ({
        url: `building/list/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["showAllBuildingData"],
    }),

    deleteBuildingData: builder.mutation({
      query: (id) => ({
        url: `building/list/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["showAllBuildingData"],
    }),

    showAllApartmentData: builder.query({
      query: (id) => `building/list/${id}/list_apartments/`,
      providesTags: ["showAllApartmentData"],
    }),

    createApartmentData: builder.mutation({
      query: (data) => ({
        url: "building/apartment/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["showAllApartmentData"],
    }),

    updateApartmentData: builder.mutation({
      query: ({ id, data }) => ({
        url: `building/apartment/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["showAllApartmentData"],
    }),

    deleteApartmentData: builder.mutation({
      query: (id) => ({
        url: `building/apartment/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["showAllApartmentData"],
    }),

    viewApartmentDetails: builder.query({
      query: (id) => `building/apartment/${id}/`,
      providesTags: ["viewApartmentDetails"],
    }),

    updateApartmentDetails: builder.mutation({
      query: ({ id, data }) => ({
        url: `building/apartment/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["viewApartmentDetails"],
    }),

    // ─── Report Issues ────────────────────────────────────────────────────
    getReportIssueList: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.date_type) searchParams.append("date_type", params.date_type);
        if (params.status) searchParams.append("status", params.status);
        if (params.issue_type) searchParams.append("issue_type", params.issue_type);
        if (params.area) searchParams.append("area", params.area);
        if (params.building || params.task__building__id)
          searchParams.append("task__building__id", params.building || params.task__building__id);
        if (params.flat) searchParams.append("flat", params.flat);

        const queryString = searchParams.toString();
        return `report_issue/list/${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["reportIssueList"],
    }),

    showMaintenanceData: builder.query({
      query: () => "report_issue/building-wise-distinct-maintenance-issue/",
      providesTags: ["showMaintenanceData"],
    }),

    showMaintenanceDetails: builder.query({
      query: (id) => `report_issue/list/?task__building__id=${id}`,
      providesTags: ["showMaintenanceDetails"],
    }),

    showMaintenanceFilterData: builder.query({
      query: ({ id, issue_type, status }) =>
        `report_issue/list/?task__building__id=${id}&issue_type=${issue_type}&status=${status}`,
      providesTags: ["showMaintenanceFilterData"],
    }),

    createReportIssue: builder.mutation({
      query: (data) => ({
        url: "report_issue/list/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "reportIssueList",
        "showMaintenanceData",
        "showMaintenanceDetails",
        "showMaintenanceFilterData",
      ],
    }),

    // ─── Completion Reports ────────────────────────────────────────────────
    getCompletionReportList: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append("status", params.status);
        if (params.report_issue_id) searchParams.append("report_issue_id", params.report_issue_id);
        const queryString = searchParams.toString();
        return `report_issue/completion-report/list/${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["completionReportList"],
    }),

    getSingleCompletionReport: builder.query({
      query: (id) => `report_issue/completion-report/list/${id}/`,
      providesTags: ["completionReportList"],
    }),

    createCompletionReport: builder.mutation({
      query: (data) => ({
        url: "report_issue/completion-report/list/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["completionReportList"],
    }),

    updateCompletionReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `report_issue/completion-report/list/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["completionReportList"],
    }),

    deleteCompletionReport: builder.mutation({
      query: (id) => ({
        url: `report_issue/completion-report/list/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["completionReportList"],
    }),

    // ─── Schedule ─────────────────────────────────────────────────────────
    createScheduleData: builder.mutation({
      query: (data) => ({
        url: "schedule/list/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["showScheduleData"],
    }),

    updateScheduleData: builder.mutation({
      query: ({ id, data }) => ({
        url: `schedule/list/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["showScheduleData"],
    }),

    showScheduleData: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.area) searchParams.append("area", params.area);
        if (params.building) searchParams.append("building", params.building);
        if (params.task_type && params.task_type !== "All")
          searchParams.append("task_type", params.task_type);
        if (params.date) searchParams.append("date", params.date);
        if (params.time) searchParams.append("time", params.time);
        if (params.status) searchParams.append("status", params.status);
        const queryString = searchParams.toString();
        return `schedule/list/${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["showScheduleData"],
    }),

    filterScheduleData: builder.query({
      query: ({ building, task_type }) =>
        `schedule/list/?building=${building}&task_type=${task_type}`,
      providesTags: ["filterScheduleData"],
    }),

    // Schedule status count (cleaner dashboard)
    showScheduleStatusCount: builder.query({
      query: (date = "") => `schedule/status-count/${date ? `?date=${date}` : ""}`,
      providesTags: ["showScheduleData"],
    }),

    // Schedule submissions list
    showScheduleSubmissions: builder.query({
      query: () => "schedule/submission/list/",
      providesTags: ["showScheduleData"],
    }),

    createScheduleSubmission: builder.mutation({
      query: (data) => ({
        url: "schedule/submission/list/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["showScheduleData"],
    }),

    showScheduleAllData: builder.query({
      query: () => "area_building_flat_api/",
      providesTags: ["showScheduleAllData"],
    }),

    // ─── User Management ──────────────────────────────────────────────────
    userCleanerFilter: builder.query({
      query: (cleaner = "cleaner") => `accounts/users/?role=${cleaner}`,
      providesTags: ["userCleanerFilter"],
    }),

    userMaintainerFilter: builder.query({
      query: (maintainer = "maintainer") => `accounts/users/?role=${maintainer}`,
      providesTags: ["userMaintainerFilter"],
    }),

    userMiniAdminFilter: builder.query({
      query: (mini_admin = "mini_admin") => `accounts/users/?role=${mini_admin}`,
      providesTags: ["userMiniAdminFilter"],
    }),

    createUsermanagementData: builder.mutation({
      query: (data) => ({
        url: "accounts/users/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["userCleanerFilter", "userMaintainerFilter", "userMiniAdminFilter"],
    }),

    updateUsermanagementData: builder.mutation({
      query: ({ id, data }) => ({
        url: `accounts/users/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["userCleanerFilter", "userMaintainerFilter", "userMiniAdminFilter"],
    }),

    deleteUsermanagementData: builder.mutation({
      query: (id) => ({
        url: `accounts/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["userCleanerFilter", "userMaintainerFilter", "userMiniAdminFilter"],
    }),

    // Toggle user active/deactive — PATCH accounts/users/{id}/active_and_deactive_user/
    toggleUserActive: builder.mutation({
      query: (id) => ({
        url: `accounts/users/${id}/active_and_deactive_user/`,
        method: "PATCH",
        body: {},
      }),
      invalidatesTags: ["userCleanerFilter", "userMaintainerFilter", "userMiniAdminFilter"],
    }),

    // ─── Areas ────────────────────────────────────────────────────────────
    showAreaList: builder.query({
      query: () => "area/list/",
      providesTags: ["showAreaList"],
    }),

    createArea: builder.mutation({
      query: (data) => ({
        url: "area/list/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["showAreaList", "showScheduleAllData"],
    }),

    updateArea: builder.mutation({
      query: ({ id, data }) => ({
        url: `area/list/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["showAreaList"],
    }),

    deleteArea: builder.mutation({
      query: (id) => ({
        url: `area/list/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["showAreaList"],
    }),

    filterByAreaData: builder.query({
      query: ({ id }) => `accounts/users/?assigned_areas=${id}`,
      providesTags: ["filterByAreaData"],
    }),

    getUsersByAreaAndRole: builder.query({
      query: ({ area_id, role }) =>
        `accounts/users/?assigned_areas=${area_id}&role=${role}`,
      providesTags: ["getUsersByAreaAndRole"],
    }),

    // ─── Team Messaging ───────────────────────────────────────────────────
    createTeamMessage: builder.mutation({
      query: (data) => ({
        url: "team_message/list/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["showTeamMessage"],
    }),

    showMessageHistory: builder.query({
      query: () => "team_message/list/",
      providesTags: ["showMessageHistory"],
    }),

    // ─── Weekly Wages ─────────────────────────────────────────────────────

    // View all wages — GET weekly_wages/wages/
    showWeeklyWages: builder.query({
      query: () => "weekly_wages/wages/",
      providesTags: ["weeklyWagesList"],
    }),

    // Generate wages — POST weekly_wages/wages/generate_wages/
    generateWeeklyWages: builder.mutation({
      query: (data) => ({
        url: "weekly_wages/wages/generate_wages/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["weeklyWagesList"],
    }),

    // View wages config list — GET weekly_wages/config/
    showWeeklyWagesConfig: builder.query({
      query: () => "weekly_wages/config/",
      providesTags: ["weeklyWagesConfig"],
    }),

    // Set rate per task for a cleaner — POST weekly_wages/config/
    createWeeklyWagesConfig: builder.mutation({
      query: (data) => ({
        url: "weekly_wages/config/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["weeklyWagesConfig"],
    }),

    // Update rate per task — PATCH weekly_wages/config/{id}/
    updateWeeklyWagesConfig: builder.mutation({
      query: ({ id, data }) => ({
        url: `weekly_wages/config/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["weeklyWagesConfig"],
    }),
  }),
});

export const {
  useShowProfileInformationQuery,
  useUpdateProfileInformationMutation,
  useChangePasswordMutation,

  useShowDashboardDataQuery,
  useShowMiniAdminDashboardDataQuery,
  useShowCleanerDashboardDataQuery,
  useShowMaintainerDashboardDataQuery,

  useShowAllBuildingDataQuery,
  useCreateBuildingDataMutation,
  useUpdateBuildingDataMutation,
  useDeleteBuildingDataMutation,

  useShowAllApartmentDataQuery,
  useCreateApartmentDataMutation,
  useUpdateApartmentDataMutation,
  useDeleteApartmentDataMutation,
  useViewApartmentDetailsQuery,
  useUpdateApartmentDetailsMutation,

  useShowMaintenanceDataQuery,
  useShowMaintenanceDetailsQuery,
  useShowMaintenanceFilterDataQuery,
  useGetReportIssueListQuery,
  useCreateReportIssueMutation,

  useGetCompletionReportListQuery,
  useGetSingleCompletionReportQuery,
  useCreateCompletionReportMutation,
  useUpdateCompletionReportMutation,
  useDeleteCompletionReportMutation,

  useShowScheduleDataQuery,
  useFilterScheduleDataQuery,
  useCreateScheduleDataMutation,
  useUpdateScheduleDataMutation,
  useShowScheduleStatusCountQuery,
  useShowScheduleSubmissionsQuery,
  useCreateScheduleSubmissionMutation,

  useShowScheduleAllDataQuery,

  useUserCleanerFilterQuery,
  useUserMaintainerFilterQuery,
  useUserMiniAdminFilterQuery,
  useCreateUsermanagementDataMutation,
  useUpdateUsermanagementDataMutation,
  useDeleteUsermanagementDataMutation,
  useToggleUserActiveMutation,

  useShowAreaListQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
  useFilterByAreaDataQuery,
  useGetUsersByAreaAndRoleQuery,

  useCreateTeamMessageMutation,
  useShowMessageHistoryQuery,

  useShowWeeklyWagesQuery,
  useGenerateWeeklyWagesMutation,
  useShowWeeklyWagesConfigQuery,
  useCreateWeeklyWagesConfigMutation,
  useUpdateWeeklyWagesConfigMutation,
} = baseApi;