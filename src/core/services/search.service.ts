import { OrganizationRepository } from '../repositories/organization/organization.repository'
import { PostRepository } from '../repositories/post/post.repository'
import { type OrganizationEntitySearch } from '../entities/organization.entity'
import { type PostEntityShort } from '../entities/post.entity'

export class SearchService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly postRepository: PostRepository,
  ) {}

  globalSearch = async (
    queryText: string,
  ): Promise<{
    organizations: OrganizationEntitySearch[]
    posts: PostEntityShort[]
  }> => {
    return {
      organizations: await this.searchOrganization(queryText),
      posts: await this.searchPost(queryText),
    }
  }

  private searchOrganization = async (queryText: string): Promise<OrganizationEntitySearch[]> => {
    return await this.organizationRepository.searchByText(queryText)
  }

  private searchPost = async (queryText: string): Promise<PostEntityShort[]> => {
    return await this.postRepository.searchByText(queryText)
  }
}
