import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  userposts: PaginatedPosts;
  uservotedposts: VotedPosts;
  editableposts: PaginatedPosts;
  votableposts: PaginatedPosts;
  usersdurations: Array<Sum>;
  userdurations: Array<SumCount>;
  me?: Maybe<User>;
  user: Array<User>;
  users?: Maybe<Array<User>>;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryUserpostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  updaterId: Scalars['Int'];
};


export type QueryUservotedpostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  updaterId: Scalars['Int'];
};


export type QueryEditablepostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryVotablepostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryUserdurationsArgs = {
  updaterId: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  title: Scalars['String'];
  text: Scalars['String'];
  duration?: Maybe<Scalars['Float']>;
  points?: Maybe<Scalars['Float']>;
  voteStatus?: Maybe<Scalars['Int']>;
  creatorId: Scalars['Float'];
  updaterId: Scalars['Float'];
  creator: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  phone: Scalars['String'];
  email: Scalars['String'];
  role: Scalars['String'];
  active: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type VotedPosts = {
  __typename?: 'VotedPosts';
  votedposts: Array<Updoot>;
  hasMore: Scalars['Boolean'];
};

export type Updoot = {
  __typename?: 'Updoot';
  value: Scalars['Float'];
  userId: Scalars['Float'];
  postId: Scalars['Float'];
};

export type Sum = {
  __typename?: 'Sum';
  sum: Scalars['Float'];
};

export type SumCount = {
  __typename?: 'SumCount';
  sum: Scalars['Float'];
  count: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  vote: Scalars['Boolean'];
  createPost: Post;
  updatePost: PostResponse;
  deletePost: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  activateuser: Scalars['Boolean'];
  deactivateuser: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationUpdatePostArgs = {
  options: PostTextinput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationActivateuserArgs = {
  id: Scalars['Int'];
};


export type MutationDeactivateuserArgs = {
  id: Scalars['Int'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<PostFieldError>>;
  post?: Maybe<Post>;
};

export type PostFieldError = {
  __typename?: 'PostFieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type PostTextinput = {
  id: Scalars['Float'];
  updaterId: Scalars['Float'];
  text: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  phone: Scalars['String'];
  password: Scalars['String'];
  role: Scalars['String'];
  active: Scalars['String'];
};

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'text' | 'duration' | 'updaterId' | 'points' | 'textSnippet' | 'voteStatus'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularPostErrorFragment = (
  { __typename?: 'PostFieldError' }
  & Pick<PostFieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'role' | 'active'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ActivateUserMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ActivateUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'activateuser'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'text' | 'points' | 'creatorId'>
  ) }
);

export type DeactivateUserMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeactivateUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deactivateuser'>
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  options: PostTextinput;
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: (
    { __typename?: 'PostResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'PostFieldError' }
      & RegularPostErrorFragment
    )>>, post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'text' | 'updaterId' | 'textSnippet' | 'createdAt' | 'updatedAt'>
    )> }
  ) }
);

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type EditablePostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type EditablePostsQuery = (
  { __typename?: 'Query' }
  & { editableposts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & PostSnippetFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export type UserQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'role' | 'active'>
  )> }
);

export type UserDurationsQueryVariables = Exact<{
  updaterId: Scalars['Int'];
}>;


export type UserDurationsQuery = (
  { __typename?: 'Query' }
  & { userdurations: Array<(
    { __typename?: 'SumCount' }
    & Pick<SumCount, 'sum' | 'count'>
  )> }
);

export type UserPostsQueryVariables = Exact<{
  updaterId: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type UserPostsQuery = (
  { __typename?: 'Query' }
  & { userposts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'role' | 'active'>
  )>> }
);

export type UsersDurationsQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersDurationsQuery = (
  { __typename?: 'Query' }
  & { usersdurations: Array<(
    { __typename?: 'Sum' }
    & Pick<Sum, 'sum'>
  )> }
);

export type UserVotedPostsQueryVariables = Exact<{
  updaterId: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type UserVotedPostsQuery = (
  { __typename?: 'Query' }
  & { uservotedposts: (
    { __typename?: 'VotedPosts' }
    & Pick<VotedPosts, 'hasMore'>
    & { votedposts: Array<(
      { __typename?: 'Updoot' }
      & Pick<Updoot, 'value' | 'userId' | 'postId'>
    )> }
  ) }
);

export type VottablePostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type VottablePostsQuery = (
  { __typename?: 'Query' }
  & { votableposts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  createdAt
  updatedAt
  title
  text
  duration
  updaterId
  points
  textSnippet
  voteStatus
  creator {
    id
    username
  }
}
    `;
export const RegularPostErrorFragmentDoc = gql`
    fragment RegularPostError on PostFieldError {
  field
  message
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  role
  active
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ActivateUserDocument = gql`
    mutation ActivateUser($id: Int!) {
  activateuser(id: $id)
}
    `;

export function useActivateUserMutation() {
  return Urql.useMutation<ActivateUserMutation, ActivateUserMutationVariables>(ActivateUserDocument);
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    createdAt
    updatedAt
    title
    text
    points
    creatorId
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeactivateUserDocument = gql`
    mutation DeactivateUser($id: Int!) {
  deactivateuser(id: $id)
}
    `;

export function useDeactivateUserMutation() {
  return Urql.useMutation<DeactivateUserMutation, DeactivateUserMutationVariables>(DeactivateUserDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($options: PostTextinput!) {
  updatePost(options: $options) {
    errors {
      ...RegularPostError
    }
    post {
      id
      text
      updaterId
      textSnippet
      createdAt
      updatedAt
    }
  }
}
    ${RegularPostErrorFragmentDoc}`;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const EditablePostsDocument = gql`
    query EditablePosts($limit: Int!, $cursor: String) {
  editableposts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function useEditablePostsQuery(options: Omit<Urql.UseQueryArgs<EditablePostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<EditablePostsQuery>({ query: EditablePostsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    ...PostSnippet
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const UserDocument = gql`
    query User($id: Int!) {
  user(id: $id) {
    id
    username
    role
    active
  }
}
    `;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const UserDurationsDocument = gql`
    query UserDurations($updaterId: Int!) {
  userdurations(updaterId: $updaterId) {
    sum
    count
  }
}
    `;

export function useUserDurationsQuery(options: Omit<Urql.UseQueryArgs<UserDurationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserDurationsQuery>({ query: UserDurationsDocument, ...options });
};
export const UserPostsDocument = gql`
    query UserPosts($updaterId: Int!, $limit: Int!, $cursor: String) {
  userposts(updaterId: $updaterId, limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function useUserPostsQuery(options: Omit<Urql.UseQueryArgs<UserPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserPostsQuery>({ query: UserPostsDocument, ...options });
};
export const UsersDocument = gql`
    query Users {
  users {
    id
    username
    email
    role
    active
  }
}
    `;

export function useUsersQuery(options: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersQuery>({ query: UsersDocument, ...options });
};
export const UsersDurationsDocument = gql`
    query UsersDurations {
  usersdurations {
    sum
  }
}
    `;

export function useUsersDurationsQuery(options: Omit<Urql.UseQueryArgs<UsersDurationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersDurationsQuery>({ query: UsersDurationsDocument, ...options });
};
export const UserVotedPostsDocument = gql`
    query UserVotedPosts($updaterId: Int!, $limit: Int!, $cursor: String) {
  uservotedposts(updaterId: $updaterId, limit: $limit, cursor: $cursor) {
    hasMore
    votedposts {
      value
      userId
      postId
    }
  }
}
    `;

export function useUserVotedPostsQuery(options: Omit<Urql.UseQueryArgs<UserVotedPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserVotedPostsQuery>({ query: UserVotedPostsDocument, ...options });
};
export const VottablePostsDocument = gql`
    query VottablePosts($limit: Int!, $cursor: String) {
  votableposts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function useVottablePostsQuery(options: Omit<Urql.UseQueryArgs<VottablePostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<VottablePostsQuery>({ query: VottablePostsDocument, ...options });
};