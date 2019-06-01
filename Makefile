TEMPLATE=dist/aws-job-scheduler.template.json

build:
	mkdir -p dist
	cfn-include -t -m serverless.template.yml > $(TEMPLATE)
	aws cloudformation validate-template --template-body file://$(TEMPLATE)

test: build
	aws cloudformation deploy --template-file $(TEMPLATE) --stack-name aws-job-scheduler --capabilities CAPABILITY_IAM

clean:
	rm -rf dist
	aws cloudformation delete-stack --stack-name aws-job-scheduler
