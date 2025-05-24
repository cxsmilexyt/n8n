import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';

export class UrlContentLength implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'URL Content Length',
		name: 'urlContentLength',
		icon: 'file:urlcontentlength.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["url"]}}',
		description: 'Fetches content from a URL and returns its length statistics',
		defaults: {
			name: 'URL Content Length',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com',
				description: 'The URL to fetch and measure content length',
				required: true,
			},
			{
				displayName: 'Request Method',
				name: 'method',
				type: 'options',
				options: [
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'HEAD',
						value: 'HEAD',
					},
				],
				default: 'GET',
				description: 'The HTTP method to use for the request',
			},
			{
				displayName: 'Timeout (ms)',
				name: 'timeout',
				type: 'number',
				default: 10000,
				description: 'Request timeout in milliseconds',
			},
			{
				displayName: 'Include Response Details',
				name: 'includeResponseDetails',
				type: 'boolean',
				default: false,
				description: 'Whether to include additional response details like status code and headers',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const url = this.getNodeParameter('url', i) as string;
				const method = this.getNodeParameter('method', i) as IHttpRequestMethods;
				const timeout = this.getNodeParameter('timeout', i) as number;
				const includeResponseDetails = this.getNodeParameter(
					'includeResponseDetails',
					i,
				) as boolean;

				if (!url) {
					throw new NodeOperationError(this.getNode(), 'URL is required', { itemIndex: i });
				}

				const options = {
					method,
					url,
					timeout,
					returnFullResponse: true,
				};

				// Make the HTTP request
				const response = await this.helpers.httpRequest(options);

				// Calculate content length statistics
				const content = response.body || '';
				const contentLengthBytes = Buffer.byteLength(content, 'utf8');

				// Count different types of characters
				const lines = content.split('\n').length;
				const words = content.trim() ? content.trim().split(/\s+/).length : 0;
				const characters = content.length;
				const charactersNoSpaces = content.replace(/\s/g, '').length;

				// Basic content analysis
				let isJson = false;
				try {
					JSON.parse(content);
					isJson = true;
				} catch {
					isJson = false;
				}

				const isXml = content.trim().startsWith('<') && content.trim().endsWith('>');
				const isHtml =
					/<html|<HTML/.test(content) || /<head|<HEAD/.test(content) || /<body|<BODY/.test(content);

				// Prepare result data
				const resultData: any = {
					url,
					method,
					contentLength: {
						characters,
						charactersNoSpaces,
						bytes: contentLengthBytes,
						lines,
						words,
					},
					contentType: {
						isJson,
						isXml,
						isHtml,
						detectedType: isJson ? 'json' : isXml ? 'xml' : isHtml ? 'html' : 'text',
					},
					timestamp: new Date().toISOString(),
				};

				// Include response details if requested
				if (includeResponseDetails) {
					resultData.response = {
						statusCode: response.statusCode,
						statusMessage: response.statusMessage,
						headers: response.headers,
						contentType: response.headers['content-type'],
					};
				}

				// Include original content if it's small enough (< 100KB)
				if (contentLengthBytes < 100 * 1024) {
					resultData.content = content;
				} else {
					resultData.contentTruncated = true;
					resultData.contentPreview = content.substring(0, 500) + '...';
				}

				returnData.push({
					json: resultData,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							url: this.getNodeParameter('url', i),
							timestamp: new Date().toISOString(),
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
