## Friday, 2/18

**10.66**

a. The *z* statistic is appropriate because the population standard deviation &sigma; is known.

b. A type I error would be concluding that &mu; = 150 when in fact &mu; > 150. A type II error would be concluding that &mu; > 150 when in fact &mu; = 150.

c. &alpha; = normalcdf(1.8, &infin;) = 0.0359

d. *z* = 1.8, *n* = 50; 1.8 = (x&#772; - &mu;) / (&sigma; / sqrt(n)); x&#772; = 155, &mu; = 153.

<!-- plots -->
<div class="normal-plot">
    <div class="plot" data-mean="153" data-sd="10" data-xbar="155" data-area="0.4207"></div>
    <div class="plot" data-mean="150" data-sd="10" data-xbar="155" data-area="0.3085"></div>
</div>

e. &beta; = normalcdf(155, &infin;, &mu; = 153, &sigma; = 10) = 0.4207

f. &mu; = 160: x&#772; = 162.5456, &beta; = normalcdf(162.5456, &infin;, &mu; = 160, &sigma; = 10) = 0.3995

g. The appropriate conclusion is that the true mean temperature exceeds 150&deg;F. There is the possibility of type I error, where H<sub>0</sub> is rejected when it is actually true.

**10.67**

a. To reject H<sub>0</sub> if *z* &leq; -1.28, &alpha; would be normalcdf(-&infin;, -1.28) = 0.1003.

b. &mu; = 9.8: x&#772; = 9.872, &beta; = 0.2358

c. &beta; will be lower if &mu; = 9.5 since the difference is greater, and thus the odds of failing to reject a true H<sub>0</sub> are smaller.

d. &mu; = 9.8: power = 0.7642, &mu; = 9.5: power = 0.9999

## Tuesday, 2/22

TODO - Wks

## Wednesday, 2/23

**11.3**

a. The two populations are distributed normally, the samples were selected independently, and the samples represent an SRS.

b. Let &mu;<sub>1</sub> be the true mean HRV of dog-owning heart attack patients and &mu;<sub>2</sub> be the true mean HRV of non-dog-owning heart attack patients.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* For non-dog-owning patients, *n* > 30, so the Central Limit Theorem assures us that the sampling distribution will be normal. For dog-owning patients, *n* < 30 but no datapoints are given, so we must assume that the population is normally distributed to proceed with the *t*-test.
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{873-800}{\sqrt{\frac{136^2}{22} + \frac{134^2}{80}}} = 2.2367$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="33.0827" data-t="2.2367" data-area="0.0322"></div>

*p* < 0.05, reject H<sub>0</sub>.

**11.5**

Let &mu;<sub>1</sub> be the true mean commute time for male Calgary residents and &mu;<sub>2</sub> be the true mean commute time for female Calgary residents. 

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; 0

&alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* > 30, so the Central Limit Theorem assures us that the sampling distribution will be normal
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{29.6-27.3}{\sqrt{\frac{24.3^2}{247} + \frac{24.0^2}{253}}} = 1.0646$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="497.3385" data-t="1.0646" data-area="0.2876"></div>

Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is insufficient evidence to conclude that there is a difference between the mean commute time for male and female Calgary residents.

**11.8**

Let &mu;<sub>1</sub> be the true mean GPA of employed students and &mu;<sub>2</sub> be the true mean GPA of unemployed students.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; < 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* > 30, so the Central Limit Theorem assures us that the sampling distributions will be normal
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{3.12-3.23}{\sqrt{\frac{0.485^2}{184} + \frac{0.524^2}{114}}} = -1.8116$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="225.5522" data-t="-1.8116" data-area="0.0357"></div>

Reject H<sub>0</sub> at &alpha; = 0.05. There is enough evidence to conclude that the mean GPA of employed students is lower than the mean GPA of unemployed students.

## Thursday, 2/24

**11.10**

**11.13**

## Friday, 2/25

## Monday, 2/28

**11.31**

**11.33**

**11.36**

## Tuesday, 3/1

**11.45**

**11.47**

**11.49**

## Wednesday, 3/2

## Thursday, 3/3

**11.61**

**11.65**